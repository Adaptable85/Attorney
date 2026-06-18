# AGENTS.md

This repository is for the Burgess Attorneys Admin Automation Platform.

## Current Phase Boundary

Phase 1B adds client, matter, document metadata and timeline persistence foundations only.

Do not build product features yet. Do not build the dashboard, invoice workflow, statement workflow, WhatsApp automation, Lexpro import, website, marketing system, outreach system, production auth, production database models, production file storage, or agent runtime yet.

Phase 1A adds only auth, role, permission, audit and persistence boundaries.
Phase 1B adds no UI and no sending/storage implementation.

## Project Non-Negotiables

- This is a legal-admin platform for Burgess Attorneys Inc.
- Client files, documents, communications and financial records are sensitive.
- Owner/principal attorney approval is mandatory for invoices, statements, legal/status communications, marketing and outreach.
- OpenClaw/AI agents may draft, prepare, transcribe, classify, research and route work only.
- OpenClaw/AI agents may not approve, send, publish, delete protected records, override accounting data or provide final legal advice.
- Wesley/build support must not have owner approval powers by default.
- Voice notes create draft billing line items only.
- Invoice numbers are assigned only on owner/principal approval.
- Lexpro remains source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.
- The Burgess platform is source of truth for invoices and client-facing statement PDFs only.
- Approved financial records require correction records/audit records for changes.
- Client documents must be private by default.
- Sensitive actions must be audit logged.
- No secrets in Git.
- No hardcoded fallback financial data.
- No unapproved delete endpoints for protected records.
- No public file storage for client documents.
- Day-one role keys are `OWNER_PRINCIPAL`, `SUPPORT_ADMIN`, `AGENT_SERVICE`, and `READ_ONLY_REVIEWER`.
- Any future permission override must be explicit and tested.
- OpenClaw/AI agents may not create or edit client or matter records directly.

## Safe Financial Defaults

- Draft invoices use internal draft IDs only.
- Approved invoices receive official invoice numbers.
- No invoice may be sent without owner/principal approval.
- No statement may be sent without owner/principal approval.
- VAT rules must be configurable.
- Default assumption for planning only: VAT applies to fees, not disbursements.
- Approved financial records must not be silently overwritten.
- Corrections must use correction records/audit records.
- Lexpro import/sync is not part of Phase -1.

## Build Discipline

- Inspect the repository before final commands or edits.
- Use repo-supported tools only.
- If package/test/build commands do not exist yet, document them as TODO instead of inventing them.
- Use TDD first for business logic.
- Auth, permissions, financial records, approval gates, document access, data mutations and agent actions are critical paths.
- Aim for 90%+ code coverage.
- Critical paths should have 100% practical coverage.
- No lint errors.
- No disabled linting.
- No skipped tests without explicit justification.
- Every future feature must include tests before completion.
- Every future phase must include acceptance criteria and validation commands.

## Context System

Read `.context/index.md` before planning future work.

Key context files:

- `.context/project_overview.md`
- `.context/agents.md`
- `.context/task_management.md`
- `.context/ai_memory.md`
- `.context/rules/operating-constraints.md`
- `.context/conventions/index.md`
- `.context/workflows/index.md`
- `.context/architecture/index.md`

## Validation

Run deterministic checks before proposing a PR:

```sh
pnpm run pre-pr
```

Available package commands:

```sh
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run build
```

Install local hooks once per clone:

```sh
git config core.hooksPath .githooks
```

Hooks and scripts must be deterministic, low-noise and must not call AI models.

## ADR Guidance

Do not create `docs/adr/` until the first ADR is accepted/needed.

Recommend an ADR only when all three are true:

1. The decision is hard to reverse.
2. The decision would be surprising without context.
3. The decision came from a real trade-off.

Known future ADR candidates:

- Burgess platform source of truth for invoices and client-facing statement PDFs.
- Lexpro retained for legal/trust accounting and reconciled payment records.
- Invoice number assigned only on owner/principal approval.
- Hosting choice.
- File storage choice.
- WhatsApp integration choice.
- Email integration choice.
