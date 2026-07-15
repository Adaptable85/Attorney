# Phase 9D - Live Staging Matters Inside Client Files

Date: 2026-07-15

## Goal

Allow a staging admin tester to open a new test matter inside a saved client file and view it from the client file and the Matters list.

## Scope

- Add `BURGESS_STAGING_MATTER_WRITES_ENABLED=true` as the explicit staging-only matter gate.
- Add client-file-scoped matter creation under `/admin/clients/[clientId]/matters/new`.
- Save matter records to the existing `Matter` table.
- Record audit and timeline metadata for created test matters.
- List saved matters inside the client file and on `/admin/matters`.
- Keep matter edit, close, archive, notes, billing, invoice, statement, Lexpro, LLM and WhatsApp actions disabled.

## Non-Scope

- No schema migration.
- No `db:push`.
- No production database command or production migration.
- No production writes.
- No live Microsoft Entra auth.
- No standalone top-level matter creation.
- No real Burgess client or matter data.
- No matter edit, close, archive or delete.
- No invoice approval, statement sending, Lexpro sync, LLM call, WhatsApp, Yoco, Payfast, shop or checkout behavior.

## Acceptance Criteria

- Saved client files show a Matters panel with existing matters.
- The Matters panel shows `Open New Matter` only when the staging matter gate is enabled.
- The new matter form validates required fields and enum values server-side.
- Successful matter creation redirects back to the client file Matters panel.
- `/admin/matters` searches and opens saved staging matters.
- Tests prove unauthenticated, gate-off and missing database states fail closed.
