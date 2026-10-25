# GBSBFORYOU AI Video Engine — Architecture & MVP contract

## Goal
Add an API-ready, provider-agnostic video-generation flow to the existing vanilla HTML/CSS/JavaScript mobile-first PWA. This is an incremental prototype, not a claim that generation is already connected.

## Current milestone
- Added `ai-video.html` mobile UI for prompt, aspect ratio, duration, provider selection, backend URL, task response and video preview.
- Frontend posts to `POST /api/video/generations` on a configured HTTPS backend.
- Frontend never accepts or stores provider API keys.
- Demo provider intentionally refuses to submit a real generation request.
- The UI only previews a video when a backend returns a valid HTTPS or blob URL.

## Backend contract to implement next
Request:
```json
{
  "provider": "huggingface",
  "prompt": "A cinematic romantic scene beside Upper Lake in Bhopal at golden hour",
  "aspect_ratio": "9:16",
  "duration_seconds": 8
}
```

Successful response (queued job):
```json
{
  "id": "job_id",
  "status": "queued",
  "status_url": "/api/video/generations/job_id"
}
```

Completed response may include `video_url` (HTTPS URL). Recommended status endpoint: `GET /api/video/generations/{id}`, returning `id`, `status` (`queued | processing | completed | failed`), optional `progress`, optional `video_url`, and a safe `error` message. Polling and download/storage policy will be implemented after a provider is selected.

## Security requirements
- Keep API keys in backend environment secrets, never in Git, frontend JavaScript, localStorage, query strings or client-visible errors.
- Validate provider allowlist, prompt length, duration and aspect ratio on the server.
- Add per-user rate limits, request timeouts, job limits and cost controls before public deployment.
- Treat provider output URLs as untrusted; allow only approved HTTPS hosts or a controlled storage domain.
- Do not send requests to arbitrary user-supplied hosts from the backend (SSRF protection).
- Show users the provider's current pricing, free-tier limits, terms and content restrictions before enabling paid generation.
- Do not commit generated video binaries to GitHub; use device download or separate object storage.

## Free-first provider strategy
First compare currently available inference providers and model licences. Hugging Face documents a text-to-video task and Inference Providers, but model/provider availability, credits, and pricing can change. Keep provider integrations behind a backend adapter so another model can replace it without changing the UI.

## Not yet implemented
- No actual provider API adapter or backend service is included yet.
- No job polling, authentication, billing guard, cloud storage or server-side MP4 assembly yet.
- Real Android browser tests have not been run.
- Keep PR #1 unmerged until manual Android smoke tests and backend/security review are complete.
