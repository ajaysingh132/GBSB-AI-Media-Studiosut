"""Minimal guarded text-to-video backend for GBSBFORYOU AI Media Studio.

Generation is disabled by default. Deploy only behind HTTPS and add authentication,
persistent rate limits and durable storage before exposing this service publicly.
"""
from __future__ import annotations

import os
import re
import uuid
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, field_validator

APP_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", str(APP_DIR.parent / "generated"))).resolve()
MAX_VIDEO_BYTES = int(os.getenv("MAX_VIDEO_BYTES", "52428800"))
VIDEO_ENABLED = os.getenv("VIDEO_GENERATION_ENABLED", "false").lower() == "true"
LOCAL_VIDEO_ENABLED = os.getenv("LOCAL_VIDEO_GENERATION_ENABLED", "false").lower() == "true"
LOCAL_VIDEO_MODEL = os.getenv("LOCAL_VIDEO_MODEL", "").strip()
LOCAL_MODEL_TOKEN = os.getenv("LOCAL_MODEL_TOKEN", "").strip()
HF_TOKEN = os.getenv("HF_TOKEN", "").strip()
VIDEO_MODEL = os.getenv("VIDEO_MODEL", "Wan-AI/Wan2.2-TI2V-5B").strip()
VIDEO_PROVIDER = os.getenv("VIDEO_PROVIDER", "fal-ai").strip()
MUSIC_ENABLED = os.getenv("MUSIC_GENERATION_ENABLED", "false").lower() == "true"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
MUSIC_MODEL = os.getenv("MUSIC_MODEL", "lyria-3.5").strip()
MAX_AUDIO_BYTES = int(os.getenv("MAX_AUDIO_BYTES", "52428800"))

app = FastAPI(title="GBSBFORYOU AI Video Engine", version="0.1.0")
# Restrict this list to the deployed website origin in production.
allowed_origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "").split(",") if x.strip()]
if allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )


class GenerationRequest(BaseModel):
    provider: Literal["huggingface", "local"] = "local"
    model: str = Field(default="", max_length=180)
    prompt: str = Field(min_length=8, max_length=2000)
    aspect_ratio: Literal["9:16", "16:9", "1:1"] = "9:16"
    duration_seconds: int = Field(default=5, ge=1, le=10)

    @field_validator("model")
    @classmethod
    def clean_model(cls, value: str) -> str:
        cleaned = value.strip()
        if cleaned and (len(cleaned) > 180 or any(ord(c) < 32 for c in cleaned)):
            raise ValueError("Invalid model identifier.")
        return cleaned

    @field_validator("prompt")
    @classmethod
    def clean_prompt(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 8:
            raise ValueError("Prompt must contain at least 8 non-space characters.")
        return cleaned


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "generation_enabled": VIDEO_ENABLED,
        "local_generation_enabled": LOCAL_VIDEO_ENABLED,
        "local_model_configured": bool(LOCAL_VIDEO_MODEL),
        "provider_configured": bool(HF_TOKEN and VIDEO_MODEL and VIDEO_PROVIDER),
        "provider": VIDEO_PROVIDER if HF_TOKEN else None,
        "music_generation_enabled": MUSIC_ENABLED,
        "music_provider_configured": bool(GEMINI_API_KEY and MUSIC_MODEL),
        "music_model": MUSIC_MODEL if GEMINI_API_KEY else None,
    }


@app.post("/api/video/generations")
def generate_video(request: GenerationRequest) -> dict:
    requested_model = request.model or (LOCAL_VIDEO_MODEL if request.provider == "local" else VIDEO_MODEL)
    if request.provider == "local":
        if not LOCAL_VIDEO_ENABLED:
            raise HTTPException(status_code=503, detail="Direct Model is disabled. Configure LOCAL_VIDEO_GENERATION_ENABLED=true after installing and testing the local runtime.")
        if not requested_model:
            raise HTTPException(status_code=503, detail="Set LOCAL_VIDEO_MODEL or enter a model ID/path supported by the local Diffusers runtime.")
        try:
            import torch
            from diffusers import DiffusionPipeline
            from diffusers.utils import export_to_video
            from tempfile import NamedTemporaryFile

            dtype = torch.float16 if torch.cuda.is_available() else torch.float32
            pipeline = DiffusionPipeline.from_pretrained(
                requested_model, torch_dtype=dtype, token=LOCAL_MODEL_TOKEN or None,
                local_files_only=os.getenv("LOCAL_MODEL_LOCAL_ONLY", "false").lower() == "true",
            )
            pipeline = pipeline.to("cuda" if torch.cuda.is_available() else "cpu")
            result = pipeline(prompt=f"{request.prompt}. Composition: {request.aspect_ratio} aspect ratio.", num_frames=request.duration_seconds * 8)
            frames = getattr(result, "frames", None)
            if not frames:
                raise RuntimeError("Local pipeline returned no frames.")
            frames = frames[0] if isinstance(frames, list) and frames and isinstance(frames[0], list) else frames
            with NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
                temp_path = Path(tmp.name)
            try:
                export_to_video(frames, str(temp_path), fps=8)
                video_bytes = temp_path.read_bytes()
            finally:
                temp_path.unlink(missing_ok=True)
        except Exception as exc:
            raise HTTPException(status_code=502, detail="Direct Model runtime failed. Check model compatibility, local weights, dependencies, and GPU/RAM in backend logs.") from exc
    elif request.provider == "huggingface":
        if not VIDEO_ENABLED:
            raise HTTPException(status_code=503, detail="API generation is disabled. Review pricing before enabling VIDEO_GENERATION_ENABLED=true.")
        if not HF_TOKEN:
            raise HTTPException(status_code=503, detail="Backend HF_TOKEN is not configured.")
        if not requested_model or not VIDEO_PROVIDER:
            raise HTTPException(status_code=503, detail="Video model/provider configuration is missing.")
        try:
            from huggingface_hub import InferenceClient
            client = InferenceClient(provider=VIDEO_PROVIDER, api_key=HF_TOKEN, timeout=300)
            prompt = f"{request.prompt}\\nComposition: {request.aspect_ratio} aspect ratio."
            video_bytes = client.text_to_video(prompt, model=requested_model, num_frames=request.duration_seconds * 8)
        except Exception as exc:
            raise HTTPException(status_code=502, detail="The configured video provider failed. Check backend logs and model/provider availability.") from exc
    else:
        raise HTTPException(status_code=400, detail="Unsupported video provider.")
    if not video_bytes:
        raise HTTPException(status_code=502, detail="The provider returned an empty video.")
    if len(video_bytes) > MAX_VIDEO_BYTES:
        raise HTTPException(status_code=413, detail="Generated video exceeds the configured output size limit.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    job_id = uuid.uuid4().hex
    filename = f"{job_id}.mp4"
    target = (OUTPUT_DIR / filename).resolve()
    if target.parent != OUTPUT_DIR:
        raise HTTPException(status_code=400, detail="Invalid generated file path.")
    target.write_bytes(video_bytes)
    return {
        "id": job_id,
        "status": "completed",
        "video_url": f"/api/video/files/{filename}",
        "duration_seconds_requested": request.duration_seconds,
        "provider": request.provider,
        "model": requested_model,
        "aspect_ratio_requested": request.aspect_ratio,
        "note": "Output duration and aspect ratio depend on the selected model/provider.",
    }


class MusicGenerationRequest(BaseModel):
    model: Literal["lyria-3.5", "lyria-3-clip-preview"] = "lyria-3.5"
    prompt: str = Field(min_length=8, max_length=4000)

    @field_validator("prompt")
    @classmethod
    def clean_music_prompt(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 8:
            raise ValueError("Music prompt must contain at least 8 non-space characters.")
        return cleaned


@app.post("/api/music/generations")
def generate_music(request: MusicGenerationRequest) -> dict:
    if not MUSIC_ENABLED:
        raise HTTPException(status_code=503, detail="Music generation is disabled. Check Google API availability and pricing before enabling it.")
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="Backend GEMINI_API_KEY is not configured.")
    if request.model not in {"lyria-3.5", "lyria-3-clip-preview"}:
        raise HTTPException(status_code=503, detail="Unsupported configured Lyria model.")
    try:
        from app.providers.gemini_music import generate_music as call_lyria
        audio_bytes, lyrics_text = call_lyria(request.prompt, request.model, GEMINI_API_KEY)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Google music generation failed. Check server logs and model/API availability.") from exc

    if len(audio_bytes) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="Generated audio exceeds the configured size limit.")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    job_id = uuid.uuid4().hex
    filename = f"{job_id}.mp3"
    target = (OUTPUT_DIR / filename).resolve()
    if target.parent != OUTPUT_DIR:
        raise HTTPException(status_code=400, detail="Invalid generated audio path.")
    target.write_bytes(audio_bytes)
    return {
        "id": job_id,
        "status": "completed",
        "audio_url": f"/api/music/files/{filename}",
        "model": request.model,
        "lyrics_or_structure": lyrics_text,
        "note": "Audio generation may consume paid API quota; check Google AI Studio limits and pricing before enabling.",
    }


@app.get("/api/music/files/{filename}")
def get_generated_music(filename: str) -> FileResponse:
    if not re.fullmatch(r"[a-f0-9]{32}\.mp3", filename):
        raise HTTPException(status_code=404, detail="Audio not found.")
    target = (OUTPUT_DIR / filename).resolve()
    if target.parent != OUTPUT_DIR or not target.is_file():
        raise HTTPException(status_code=404, detail="Audio not found.")
    return FileResponse(target, media_type="audio/mpeg", filename=filename)


@app.get("/api/video/files/{filename}")
def get_generated_video(filename: str) -> FileResponse:
    if not re.fullmatch(r"[a-f0-9]{32}\.mp4", filename):
        raise HTTPException(status_code=404, detail="Video not found.")
    target = (OUTPUT_DIR / filename).resolve()
    if target.parent != OUTPUT_DIR or not target.is_file():
        raise HTTPException(status_code=404, detail="Video not found.")
    return FileResponse(target, media_type="video/mp4", filename=filename)
