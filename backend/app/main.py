"""Meri Aawaz AI Singer API scaffold.

This service deliberately does not accept or store audio until authentication,
private object storage, consent records, and a verified SVC worker are configured.
"""
from __future__ import annotations

import os
from typing import Literal

from fastapi import Depends, FastAPI, Header, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI(
    title="Meri Aawaz AI Singer API",
    version="0.1.0",
    description="Secure integration scaffold; singing inference is not enabled yet.",
)

API_TOKEN = os.getenv("SINGER_API_TOKEN", "").strip()
SVC_PROVIDER = os.getenv("SINGER_SVC_PROVIDER", "").strip()
ALLOWED_ORIGINS = [
    item.strip()
    for item in os.getenv("SINGER_ALLOWED_ORIGINS", "").split(",")
    if item.strip()
]


class GenerationRequest(BaseModel):
    workflow: Literal["voice_conversion", "singing_synthesis"]
    language: str = Field(min_length=2, max_length=32)
    voice_sample_id: str | None = Field(default=None, max_length=128)
    source_vocal_id: str | None = Field(default=None, max_length=128)
    lyrics: str | None = Field(default=None, max_length=5000)
    rights_confirmed: bool = False
    consent_confirmed: bool = False


def require_api_token(authorization: str | None = Header(default=None)) -> None:
    # Fail closed: never expose a working protected endpoint with a blank token.
    if not API_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Backend authentication is not configured.",
        )
    expected = f"Bearer {API_TOKEN}"
    if authorization != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="A valid bearer token is required.",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "meri-aawaz-ai-singer", "version": "0.1.0"}


@app.get("/api/music/capabilities")
def capabilities() -> dict:
    return {
        "api_scaffold": True,
        "voice_conversion": SVC_PROVIDER.lower() == "soulx-singer",
        "singing_synthesis": False,
        "provider": SVC_PROVIDER or None,
        "audio_upload_enabled": False,
        "note": "Inference and private audio storage are not enabled in this scaffold.",
    }


@app.post("/api/music/generations", dependencies=[Depends(require_api_token)])
def create_generation(request: GenerationRequest) -> dict:
    if not request.consent_confirmed:
        raise HTTPException(status_code=400, detail="Explicit voice-owner consent is required.")
    if not request.rights_confirmed:
        raise HTTPException(status_code=400, detail="Confirm rights to the source audio and music.")
    if request.workflow == "voice_conversion":
        if not request.voice_sample_id or not request.source_vocal_id:
            raise HTTPException(
                status_code=422,
                detail="Voice conversion requires both a voice sample and a full source-vocal asset.",
            )
    else:
        raise HTTPException(
            status_code=503,
            detail="Lyrics-and-melody singing synthesis is not connected yet.",
        )

    # Do not pretend a job was queued: the GPU worker is intentionally not wired.
    raise HTTPException(
        status_code=503,
        detail="No verified SVC inference worker is connected yet. No audio was uploaded or processed.",
    )
