# GBSB AI Media Studio

Mobile-first, browser-based media workspace for GBSBFORYOU. The current project is a lightweight HTML/CSS/JavaScript PWA; it is not a React/Next.js application.

## Current status

The `feature/euron-player-integration` branch adds video playback, project management, shot planning, and an API-ready AI Video Engine interface. Review it through [Pull Request #1](https://github.com/ajaysingh132/GBSB-AI-Media-Studiosut/pull/1). It remains a draft until required Android browser smoke tests are completed.

### Available in this branch

- Play direct MP4/WebM URLs and HLS streams (native support or pinned hls.js).
- Preview a video selected from the device; the file is **not uploaded**.
- Playback speed, seek ±10 seconds, fullscreen, WebVTT subtitle URL and visual watermark overlay.
- Store small project metadata locally in browser localStorage.
- Script & Shot Planner with local autosave, visual/audio notes, duration, shot ordering, and JSON/TXT export.
- AI Video Engine UI for prompt, aspect ratio, duration and provider selection, designed to call a future secure backend at `POST /api/video/generations`.
- Service worker caches the new planner and AI Video Engine assets.
- GitHub Actions syntax and structural checks.

## Open the tools

- `video.html` — playback / preview.
- `projects.html` — local project list.
- `storyboard.html` — script and shot planner.
- `ai-video.html` — API-ready AI Video Engine UI.

Use the deployed HTTPS site for service-worker/PWA behavior; do not open HTML directly from device storage.

## AI Video Engine backend\n\n- Backend MVP: `backend/app/main.py` (FastAPI) with a Hugging Face text-to-video adapter, health endpoint, and generated-video response route.\n- Generation is disabled by default and requires a backend-only `HF_TOKEN` plus deliberate configuration. Provider requests may consume credits or cost money; check current pricing before enabling.\n- Setup and safeguards: [backend/README.md](backend/README.md).\n\n## Important AI generation status

**Real AI video generation is not connected yet.** The AI Video Engine frontend is a scaffold; the backend and provider adapter must be implemented and deployed before it can generate clips. See [AI Video Engine Architecture](docs/AI-VIDEO-ENGINE-ARCHITECTURE.md).

GitHub Pages is static hosting and cannot safely hold provider API keys or run the generation backend. API keys must remain in backend environment secrets. Do not put secrets in frontend code, localStorage, Git commits, screenshots or public issues.

## Test checklist

Use [docs/MOBILE-VIDEO-SMOKE-TEST.md](docs/MOBILE-VIDEO-SMOKE-TEST.md) to test playback on an actual Android browser. Manual device tests have not been marked passed unless performed.

Automated validation checks source syntax and expected structure; it does not prove playback works on every phone or that an AI provider is connected.

## Current limitations

- No live AI provider adapter or generation backend yet.
- No job polling, user authentication, billing guard, cloud project storage or server-side MP4 assembly yet.
- Local video preview does not upload files.
- No permanent watermark rendered into an exported file.
- No authenticated Euron playback sessions or encrypted HLS delivery.
- Real Android browser testing is still outstanding.

## Design principles

1. **Mobile-first** — keep controls usable on a phone.
2. **Free-first** — do not incur costs without explicit approval.
3. **Provider-agnostic** — replace AI, voice, storage and transcoding providers behind adapters.
4. **Backend before secrets** — never embed provider credentials in frontend code.
5. **Small verified increments** — automated checks first, real-device tests before merge.

## Repository map

- `video.html`, `js/video.js`, `js/video-player.js` — playback and media preview.
- `projects.html`, `js/projects.js`, `css/projects.css` — local project manager.
- `storyboard.html`, `js/storyboard.js`, `css/storyboard.css` — script and shot planning.
- `ai-video.html`, `js/ai-video.js`, `css/ai-video.css` — API-ready generation interface.\n- `backend/app/main.py` — guarded FastAPI generation endpoint and Hugging Face adapter.\n- `backend/README.md` — backend setup, cost guardrails, and API contract.
- `docs/AI-VIDEO-ENGINE-ARCHITECTURE.md` — backend contract and security plan.
- `service-worker.js` — offline asset caching.
- `.github/workflows/validate-video.yml` — automated validation.

## Development and validation

The repository workflow uses Node.js 22. Syntax checks require no package installation. Browser/device playback and backend generation require separate manual verification.

## License

See [LICENSE](LICENSE).


## AI Music Studio (Google Lyria)

- Mobile-first page: `ai-music.html`.
- Backend route: `POST /api/music/generations`; audio route: `GET /api/music/files/{filename}`.
- Supported model IDs: `lyria-3.5` (full-length song) and `lyria-3-clip-preview` (30-second clip).
- Set `GEMINI_API_KEY` only as a backend environment secret. Never put it in frontend code or commit a real key.
- Music generation is disabled by default. Check Google AI Studio access, model availability, terms and current pricing first; enable only after explicit operator approval by setting `MUSIC_GENERATION_ENABLED=true`.
- This integration is code-level only until the backend is deployed, the API key is configured, and a real audio-generation test succeeds. Google API availability and costs are account-dependent.
