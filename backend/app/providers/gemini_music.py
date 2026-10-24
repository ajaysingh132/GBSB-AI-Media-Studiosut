"""Google Lyria music-generation adapter.

Uses Google's documented Interactions REST API. API keys stay server-side.
Music generation remains disabled unless MUSIC_GENERATION_ENABLED=true.
"""
from __future__ import annotations

import base64
import json
import os
import urllib.error
import urllib.request


GOOGLE_INTERACTIONS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions"


def generate_music(prompt: str, model: str, api_key: str) -> tuple[bytes, str | None]:
    """Return (audio_bytes, generated_text) from Lyria output blocks."""
    payload = json.dumps({"model": model, "input": prompt}).encode("utf-8")
    request = urllib.request.Request(
        GOOGLE_INTERACTIONS_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=300) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        # Do not return Google's response body, which may contain account details.
        raise RuntimeError(f"Google music API returned HTTP {exc.code}") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise RuntimeError("Could not reach Google music API") from exc

    text_parts: list[str] = []
    audio_data: str | None = None
    for step in result.get("steps", []):
        if step.get("type") != "model_output":
            continue
        for block in step.get("content", []):
            if block.get("type") == "text" and block.get("text"):
                text_parts.append(block["text"])
            elif block.get("type") == "audio" and block.get("data"):
                audio_data = block["data"]

    # Some response variants may expose convenience output fields.
    if not audio_data:
        output_audio = result.get("output_audio")
        if isinstance(output_audio, dict):
            audio_data = output_audio.get("data")
    if not audio_data:
        raise RuntimeError("Google music API response contained no audio block")

    try:
        audio_bytes = base64.b64decode(audio_data, validate=True)
    except (ValueError, TypeError) as exc:
        raise RuntimeError("Google music API returned invalid audio data") from exc
    if not audio_bytes:
        raise RuntimeError("Google music API returned empty audio")
    return audio_bytes, "\n".join(text_parts).strip() or None
