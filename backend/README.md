# GBSBFORYOU AI Video Engine — Backend MVP

This FastAPI backend provides the first provider adapter for the existing mobile-first frontend.

## Safety first

- Generation is **disabled by default** (`VIDEO_GENERATION_ENABLED=false`).
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
