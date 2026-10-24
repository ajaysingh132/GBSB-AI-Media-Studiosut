# GBSB AI Media Studio

Mobile-first, browser-based media workspace for GBSBFORYOU. The current project is a lightweight HTML/CSS/JavaScript PWA; it is not a React/Next.js application.

## Current status

The `feature/euron-player-integration` branch adds a video preview and playback workflow. Review it through [Pull Request #1](https://github.com/ajaysingh132/GBSB-AI-Media-Studiosut/pull/1). It remains a draft until the required Android browser smoke tests are completed.

### Available in the Video Studio branch

- Play direct MP4/WebM URLs.
- HLS playback using native browser support or a lazily loaded, pinned hls.js library.
- Preview a video selected from the device; the file is **not uploaded**.
- Playback speed, seek ±10 seconds, fullscreen, WebVTT subtitle URL and visual watermark overlay.
- Store a small list of recent project metadata in browser localStorage.
- Avoid saving URLs with credentials, query parameters or fragments.
- Cache the player assets through the service worker.
- Script and shot planning with local autosave, duration/visual/audio notes, shot reordering, and JSON/TXT export.
- Run JavaScript syntax and structural checks in GitHub Actions.

## Open Video Studio

Open `video.html` in a browser through the project's hosted site. For reliable service-worker and PWA behavior, use HTTPS or localhost rather than opening the file directly from device storage.

## Test checklist

Use [docs/MOBILE-VIDEO-SMOKE-TEST.md](docs/MOBILE-VIDEO-SMOKE-TEST.md) to check the player on an actual Android browser. The checklist intentionally marks manual tests as **Not run** until they are performed on a device.

Automated validation checks source syntax and expected safety/structure; it does not prove playback works on every phone or for every media URL.

## Current limitations

This is a playback/preview milestone, not a complete AI video production engine.

Not yet implemented:
- AI script-to-video generation or provider integrations.
- Server-side video upload or cloud project storage.
- FFmpeg transcoding or final MP4 export.
- Permanent watermark rendering into the exported video.
- Authenticated Euron playback sessions or encrypted HLS delivery.
- Backend user accounts, project synchronization or API-key management.

HLS playback depends on browser compatibility, network access, CORS policy and valid media authorization. Do not paste API keys or signed media URLs into source code, public issues, screenshots or localStorage.

## Design principles

1. **Mobile-first:** keep primary controls usable on a phone.
2. **Free-first:** avoid introducing paid infrastructure without a clear need.
3. **Provider-agnostic:** add future AI, voice, storage and transcoding providers behind replaceable adapters.
4. **API/backend before secrets in UI:** never embed provider credentials in frontend code.
5. **Small verified increments:** automated checks first, real-device smoke tests before merge.

## Repository map

- `video.html` — Video Studio page.
- `storyboard.html` — Script and shot planner with local autosave and JSON/TXT export.
- `js/storyboard.js` / `css/storyboard.css` — storyboard behavior and mobile styles.
- `js/video.js` — page controller and recent-project metadata.
- `js/video-player.js` — player adapter for direct media and HLS.
- `css/video.css` — Video Studio-specific styles.
- `service-worker.js` — offline asset caching.
- `docs/EURON-INTEGRATION-AUDIT.md` — integration boundaries and audit.
- `docs/MOBILE-VIDEO-SMOKE-TEST.md` — manual Android test checklist.
- `.github/workflows/validate-video.yml` — automated validation workflow.

## Development and validation

The repository's GitHub Actions workflow uses Node.js 22 to run syntax checks and the structural smoke test:

```sh
node --check js/storyboard.js
node --check js/video.js
node --check js/video-player.js
node --check service-worker.js
node scripts/check-video-studio.mjs
```

No package installation is required for these checks. Browser/device playback still needs manual verification.

## License

See [LICENSE](LICENSE).
