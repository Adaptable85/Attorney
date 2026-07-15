# Phase 9E: Live Staging Matter Documents and Legal Timeline

## Status

Implemented for Railway staging only.

## Scope

Phase 9E extends saved staging matters with:

- matter-level test document upload,
- matter-level document view and download,
- legal timeline note capture,
- matter timeline listing,
- audit and timeline records for the new staging actions.

## Safety Boundary

This phase remains limited to staging admin password sessions and explicit gates:

- `BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED=true` for matter document upload/access.
- `BURGESS_STAGING_MATTER_WRITES_ENABLED=true` for legal timeline notes.

It does not enable production writes, Microsoft Entra live auth, matter editing,
matter closing, matter archiving, invoice approval, statement sending, Lexpro
sync, WhatsApp, payment flows, Yoco, Payfast, shop, checkout, LLM calls, or real
Burgess client data entry.

## Data Model

No schema migration is required. This phase uses existing models:

- `DocumentRecord`
- `DocumentContent`
- `MatterNote`
- `TimelineEvent`
- `AuditLog`

Matter documents are stored in Railway staging Postgres as small test files only.
External document storage remains a later architecture decision.

## Smoke Test

Use one disposable staging matter only:

1. Sign in to admin.
2. Open a saved test matter.
3. Upload one clearly marked test document.
4. Confirm it appears in the matter document list.
5. View and download the uploaded document.
6. Add one clearly marked legal timeline note.
7. Confirm it appears in the legal timeline.

Do not enter real Burgess client or matter data.
