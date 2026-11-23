# Meri Aawaz AI Singer — MVP integration notes

## Repository choice
This module is added to `GBSB-AI-Media-Studiosut`, the existing mobile-first GBSB AI Media Studio PWA. The repository already has a dashboard, Voice Library, browser voice engine, audio engine, projects and settings. The existing `VoiceEngine` uses browser SpeechSynthesis; it is TTS, not singing voice cloning.

## Current MVP
- Mobile-first singer page at `singer.html`.
- Song metadata and rights-source selection.
- Browser microphone capture using MediaRecorder, preview and sample download.
- Explicit own-voice and song-rights consent.
- Export of a request manifest; no fake claim that a full song was generated.

## Production pipeline still required
1. Authenticated upload endpoint; private object storage with short-lived signed URLs.
2. Voice enrollment and consent record for the user's own voice; verify sample quality and request a longer sample when needed.
3. Singing voice conversion/synthesis model or provider that supports singing (ordinary TTS is insufficient).
4. Licensed instrumental/accompaniment source or original music generation; do not fetch or reproduce copyrighted master recordings without authorization.
5. Async job queue, progress/status endpoint, output storage, download and deletion controls.
6. Rate limits, cost controls, retention policy, abuse reporting and audit logs.

## Suggested API contract
- `POST /api/music/voice-samples` — upload sample; returns `sample_id`.
- `POST /api/music/generations` — accepts `song_request`, `sample_id`, rights declaration and consent; returns `job_id`.
- `GET /api/music/generations/{job_id}` — queued/running/succeeded/failed status and output URL.
- `DELETE /api/music/voice-samples/{sample_id}` — user-controlled deletion.

## Safety and rights
Only clone the authenticated user's own voice or a voice for which documented permission exists. Require appropriate rights to lyrics, composition, arrangement, karaoke track and master recording. Do not imitate a named singer's voice. Clearly label AI-generated output.
