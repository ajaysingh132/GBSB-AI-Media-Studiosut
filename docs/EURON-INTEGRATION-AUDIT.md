# GBSB AI Media Studio — Euron Integration Audit

## Current repository findings
- The application is a mobile-first vanilla HTML/CSS/JavaScript PWA, not a React/Next.js application.
- `video.html` is the Video Studio screen; before the integration, `js/video.js` showed placeholder alerts for video creation/export.
- `js/api.js` is a generic fetch wrapper, but no production backend URL or video API is configured.
- `js/storage.js` uses browser localStorage. It is local to the current browser/device and is not a cloud database.
- AI generation, server upload and FFmpeg transcoding are not implemented by the current video controller.

## Euron features mapped into this application
- HLS playback via hls.js with native-HLS fallback.
- Basic playback controls: seek ±10 seconds, playback speed, fullscreen, optional WebVTT subtitles.
- Optional viewer watermark overlay.
- Recent project metadata saved locally.
- A source adapter boundary so a future backend can return MP4 or tokenized HLS URLs.

## Deliberate differences from Euron
This is an Euron-inspired integration, not a copy of Euron's React player or AWS control plane. The existing app uses vanilla JavaScript, so the player is implemented as a small vanilla-JS module to avoid migrating the whole app to React.

## What this milestone does NOT do
- It does not upload a local file to a server; local files are previewed using a browser object URL.
- It does not generate AI video or encode/transcode with FFmpeg.
- It does not create Euron playback sessions, encrypt HLS media, or secure private media.
- It does not store API secrets. Do not put provider credentials in frontend JavaScript or localStorage.
- HLS playback may fail when a host does not permit browser CORS requests or requires inaccessible authorization headers.

## Next integration milestone
1. Add a backend endpoint that accepts uploads or references existing media.
2. Run FFmpeg in a suitable worker environment; do not run a long FFmpeg job inside a browser page.
3. Return a media record and a playback URL (MP4 or HLS manifest) to the frontend.
4. Persist projects in an authenticated database if cross-device access is needed.
5. Add provider adapters for AI video, TTS/STT and storage separately from the player.
