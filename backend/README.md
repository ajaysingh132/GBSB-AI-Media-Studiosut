# GBSBFORYOU AI Video Engine — Backend MVP

This FastAPI backend provides a guarded Hugging Face inference adapter and an opt-in, API-free local Diffusers runner for compatible text-to-video pipelines.

## Safety first

- Hosted API generation is **disabled by default** (`VIDEO_GENERATION_ENABLED=false`).
- Direct local generation is separately **disabled by default** (`LOCAL_VIDEO_GENERATION_ENABLED=false`).
- Hugging Face Inference Providers may use credits or incur charges. Review current account credits and the selected provider/model's price before enabling.
- Never put `HF_TOKEN` in frontend JavaScript, GitHub commits, screenshots, or localStorage.
- Do not expose this prototype publicly until authentication, persistent rate limiting, spending controls, durable storage, and HTTPS deployment are configured.
- Generated files are written to local storage on the backend; ephemeral hosts may erase them on restart/redeploy.

## Local setup

Use Python 3.11 or newer.

```sh
cd backend
python -m venv .venv
# Activate the environment, then:
pip install -r requirements.txt
```

Set environment variables in the server environment (not in the repository):
- `HF_TOKEN`: Hugging Face token with Inference Providers permission.
- `VIDEO_MODEL`: model supported by the chosen provider.
- `VIDEO_PROVIDER`: provider routing ID supported by the current Hugging Face SDK.
- `VIDEO_GENERATION_ENABLED=false` until billing and model availability are verified.
- `LOCAL_VIDEO_GENERATION_ENABLED=true` only after installing and testing a compatible local runtime.
- `LOCAL_VIDEO_MODEL`: local model directory or a Diffusers-compatible model ID. A model ID may need downloading and internet access the first time.
- `LOCAL_MODEL_LOCAL_ONLY=true` forces loading only from local cache/files. `LOCAL_MODEL_TOKEN` is optional and should only be used server-side for gated model downloads.

### API-free Direct Model mode

Select **Direct Model — अपना सर्वर (API नहीं)** in the mobile studio and enter a local model directory or compatible Diffusers model ID. The backend loads the model weights and generates frames on its own machine; this does not call an inference API. It still requires a suitable compatible pipeline, PyTorch, Diffusers, video encoding support, and substantial memory/GPU resources for most video models. The generic `DiffusionPipeline` path is not compatible with every video model architecture; test a chosen model on the target machine first. For CPU-only machines, generation can be extremely slow or fail due to memory limits.

Install the local runtime separately on a compatible GPU server (versions depend on the chosen model): `pip install torch diffusers transformers accelerate imageio-ffmpeg`. Do not add these large GPU packages to a lightweight deployment unless that host supports them.
- `CORS_ORIGINS`: comma-separated exact deployed frontend origins.

Run the health endpoint first:

```sh
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Open `/health`. With generation disabled, the generation endpoint returns HTTP 503 without calling the provider. Enable generation only deliberately after checking current pricing and account billing.

## API

`POST /api/video/generations`

```json
{
  "provider": "huggingface",
  "model": "Wan-AI/Wan2.2-TI2V-5B",
  "prompt": "A cinematic romantic scene beside Upper Lake in Bhopal at golden hour",
  "aspect_ratio": "9:16",
  "duration_seconds": 5
}
```

A successful response includes `id`, `status: completed`, and `video_url`. The frontend should join a relative video URL to the configured backend base URL.

## Current limits

- Synchronous generation; the request can take several minutes.
- Only the Hugging Face provider adapter is implemented.
- Aspect ratio and duration support varies by model/provider. The adapter requests an approximate frame count and includes the desired ratio in the prompt; it cannot guarantee exact output dimensions.
- No user authentication, persistent queue, durable media storage, scheduled cleanup, or production-grade cost/rate controls yet.
- Provider/model access and pricing must be verified against the current Hugging Face documentation before use.
