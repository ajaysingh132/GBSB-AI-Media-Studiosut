# Meri Aawaz AI Singer — backend scaffold

Status: **API scaffold only; no singing generation is enabled.**

## Run locally

Python 3.10+ is recommended.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

On Windows, activate the virtual environment with `.venv\\Scripts\\activate`.

Check `GET /health` and `GET /api/music/capabilities`.

## Protected generation endpoint

Set a long random `SINGER_API_TOKEN` before using the protected endpoint.
Optionally set `SINGER_SVC_PROVIDER=soulx-singer` only after a real, tested worker is deployed.

`POST /api/music/generations` currently validates consent, rights confirmation, and required asset IDs, then returns HTTP 503 because no inference worker is connected. It does not accept audio uploads, create jobs, or store files.

## Before enabling real audio processing

1. Add user authentication and per-user authorization; do not expose a shared static token to a public browser.
2. Add private object storage with short-lived signed upload/download URLs.
3. Add explicit, revocable voice-owner consent and a deletion workflow.
4. Validate file signatures, codecs, duration, size, and malware risk server-side.
5. Deploy the licensed SoulX-Singer/SVC code and model weights on a private GPU worker; verify each code/weight license and commercial-use terms.
6. Add a durable job queue, isolated worker, rate limits, cost limits, audit logs, and retention policy.
7. Evaluate Hindi singing quality, including lyrics intelligibility, melody/rhythm preservation, voice similarity, and artifacts.

## Model integration note

SoulX-Singer-SVC converts a **full source singing performance** into a target voice timbre. A short recording of the user is the target voice reference; it is not the complete song input. Hindi quality must be benchmarked before launch. The separate SoulX-Singer synthesis path needs lyrics plus melody/score conditioning and is not implemented here.

Official upstream: https://github.com/Soul-AILab/SoulX-Singer
