# Varya Integration (Pilot Scaffold)

Status: **scaffold only — not connected to Varya yet**.

This directory reserves a provider adapter for Varya in GBSBFORYOU AI Media Studio. The Varya API access request is currently under review. Do not assume API endpoints, request fields, response schemas, authentication headers, or webhook behavior until Avataar/Varya supplies official API documentation and approves access.

## Planned capabilities

- Text-to-video
- Image-to-video
- Generation status polling
- Video retrieval/download
- Video continuation, if included in the approved API
- A ChatGPT-facing MCP interface backed by the same server-side adapter

## Security rules

1. Keep the Varya API key only in server-side environment secrets.
2. Never commit real keys, tokens, cookies, or customer data.
3. Do not expose the provider key to browser/mobile clients.
4. Add request limits, timeouts, logging redaction, and usage/cost controls before enabling paid generation.
5. Use only approved API endpoints and documented schemas.

## Required before live integration

- API access approval
- Official API reference or OpenAPI schema
- Confirmed authentication method
- Confirmed pricing, free credits, rate limits, and permitted use
- A test key or sandbox credentials

## Planned environment variables

See `.env.example`. Values are placeholders only. The provider base URL and endpoint paths must be filled from official documentation; do not guess them.

## Current verification

- [x] Feature branch created from `main`
- [x] Integration scaffold documented
- [ ] Varya API access approved
- [ ] Official API contract received
- [ ] Secure server-side adapter implemented
- [ ] MCP tools implemented and tested
- [ ] Free/sandbox generation verified
- [ ] Cost controls and deployment configured
