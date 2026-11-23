# Meri Aawaz AI Singer — implementation plan

## Repository and existing application
This module belongs in `GBSB-AI-Media-Studiosut`, the existing mobile-first GBSB AI Media Studio PWA. The existing browser `VoiceEngine` is SpeechSynthesis/TTS, not singing voice cloning. The current Singer page captures a microphone sample and exports a request manifest; it does not claim to generate a finished song until a singing model backend is connected.

## Correct product workflow
1. User searches/selects a song.
2. User records a short singing reference in their own voice (four lines can be a first trial; request a longer clean sample if quality checks fail).
3. The service obtains a source vocal and accompaniment only from user-uploaded or properly licensed material. A commercial recording must not be fetched or reproduced without rights.
4. Separate/prepare the source vocal, preserve its lyrics, melody, rhythm and timing.
5. Run Singing Voice Conversion (SVC) to transfer the source singer timbre to the user's enrolled voice reference.
6. Mix the converted vocal with the authorized instrumental, master, and return an AI-labelled downloadable audio file.

Important distinction: the user singing four lines is a *voice reference*, not enough musical material to create the whole song by itself. A source vocal performance of the complete song (or a properly licensed vocal stem) is also required for audio-to-audio SVC. If the user wants AI to invent the rest of the singing from only four lines, that is a different lyrics+melody-conditioned singing synthesis workflow.

## Model evaluation and recommended pilot
### Primary candidate: SoulX-Singer-SVC
- Official repository: https://github.com/Soul-AILab/SoulX-Singer
- Official project describes SoulX-Singer-SVC as zero-shot, transcription-free audio-to-audio singing voice conversion, preserving the source performance while transferring target timbre.
- Official repository provides an Apache-2.0 code license and pretrained SVC weights.
- It has an inference WebUI and an `infer_svc.sh` example.
- It is the best first technical pilot for this product's *source-song vocal -> user's voice* use case.
- Caveat: the project describes a large multilingual training corpus (Mandarin, English, Cantonese); Hindi/Banjara quality is not guaranteed. Must run a consented Hindi test before selecting it for production. Check model-weight and dataset terms separately before commercial deployment.

### Secondary candidate: Seed-VC
- Official repository: https://github.com/Plachtaa/seed-vc
- Supports zero-shot singing voice conversion and short reference prompts, but upstream repository was archived on 2025-11-21. Treat it as a benchmark/fallback, not the default production dependency.
- GPL-3.0; review obligations before distribution/commercial integration.

### Not the right tool by itself
Ordinary TTS / speech voice cloning (including the current browser SpeechSynthesis engine) does not convert a complete singing performance. RVC may be a later benchmark, but typically requires a trained speaker model and more curated data.

## Production pipeline
- Frontend: existing PWA, mobile recording, upload progress, job status, preview, download, deletion.
- API: authenticated FastAPI service; signed upload URLs; strict size/type/duration limits.
- Storage: private object storage; never expose raw voice samples publicly.
- Worker: GPU job queue; vocal separation for authorized input, SVC inference, accompaniment mix, loudness normalization.
- Data: consent receipt, source-rights declaration, model/version provenance, job audit record.
- Security: per-user authorization, rate limits, retention/deletion controls, malware/content checks, no public voice-model sharing by default.
- Cost: queue and cap GPU minutes; show estimated cost before generation; begin with a limited pilot rather than promise free unlimited generation.

## Suggested API contract
- `POST /api/music/voice-samples` — authenticated upload; returns `sample_id`.
- `POST /api/music/generations` — accepts `song_request`, `sample_id`, authorized source-vocal/accompaniment asset IDs, rights declaration and consent; returns `job_id`.
- `GET /api/music/generations/{job_id}` — queued/running/succeeded/failed status and output URL.
- `DELETE /api/music/voice-samples/{sample_id}` — user-controlled deletion.
- `DELETE /api/music/generations/{job_id}` — delete output and associated temporary artifacts.

## Acceptance test
Use a user-owned voice reference and an original/licensed Hindi vocal+instrumental sample. Compare source and converted output for melody/F0 preservation, lyric intelligibility, timing, voice similarity, artifacts, latency and GPU cost. Do not enable public release until Hindi results, consent handling, deletion, and commercial model/weight terms are reviewed.

## Rights and consent
Only enroll the authenticated user's own voice, or a voice with documented permission. Do not imitate a named singer's voice. Require appropriate rights to lyrics, composition, arrangement, karaoke track and master recording. Clearly label AI-generated output. The model authors' usage disclaimer also prohibits unauthorized impersonation and deceptive audio.
