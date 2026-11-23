# Hugging Face pilot plan — Meri Aawaz AI Singer

## Account and deployment constraints

The connected Hugging Face account is a free personal account (not PRO). Do not request paid GPU hardware or launch a paid job without explicit approval.

Hugging Face ZeroGPU hosting currently supports Gradio Spaces only. Free personal accounts in good standing may host up to two ZeroGPU Spaces. The current published free-account quota is 5 GPU minutes per day; queue priority and quota can change. Verify the live limits in Hugging Face settings before testing.

Official documentation:
- ZeroGPU: https://huggingface.co/docs/hub/spaces-zerogpu
- Spaces overview: https://huggingface.co/docs/hub/spaces-overview
- Spaces API endpoints: https://huggingface.co/docs/hub/spaces-api-endpoints

## Model candidate

- Model repository: https://huggingface.co/Soul-AILab/SoulX-Singer
- Official Space: https://huggingface.co/spaces/Soul-AILab/SoulX-Singer
- Upstream code: https://github.com/Soul-AILab/SoulX-Singer

Upstream describes two distinct tasks:
1. SoulX-Singer-SVC: source-singing audio to target singer timbre conversion.
2. SoulX-Singer SVS: singing synthesis conditioned by lyrics and melody/score.

The model metadata currently lists English and Chinese; do not assume Hindi or Banjara language performance. Test Hindi audio manually and record results.

## Pilot sequence (free-first)

1. Open the official Space from an Android browser and inspect whether SVC is available in its current UI.
2. Use only a short, self-recorded voice reference and a source vocal/music track that the user owns or has permission to use.
3. If the UI exposes SVC, run one short test and save the output privately.
4. Evaluate voice similarity, Hindi lyric intelligibility, melody/rhythm preservation, artifacts, latency and quota use.
5. Do not upload sensitive/private recordings to a public demo. Review the Space's visibility and data handling first.
6. Only after a successful pilot, create a dedicated private or appropriately protected Gradio ZeroGPU Space for GBSBFORYOU.
7. Keep the main mobile web app and inference service separate. Connect them through authenticated, short-lived API access; never embed a Hugging Face write token or shared secret in browser JavaScript.

## Stop/go criteria

Proceed to a dedicated deployment only if:
- Hindi lyrics remain intelligible;
- melody and timing are preserved;
- the converted voice is recognizably close to the consenting voice owner;
- no unacceptable artifacts are present;
- model code and downloaded weight terms are reviewed for the intended use;
- private upload, consent revocation and deletion are implemented.

## Current project status

This document is a deployment plan, not a deployed Space. No Hugging Face Space was created, no GPU was allocated, and no audio was uploaded by this change.
