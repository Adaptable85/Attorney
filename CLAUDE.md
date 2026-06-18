# CLAUDE.md

This repository is for the Burgess Attorneys Admin Automation Platform.

## Standing Instruction

Work safely, locally and deterministically. Do not assume missing frameworks, commands, APIs, hosting, financial rules, Lexpro capabilities, WhatsApp provider details, email provider details, or storage architecture.

Phase 2A is a protected, role-aware admin shell UI with placeholder module cards only. Do not create client/matter CRUD, invoice workflows, statement workflows, production auth, production migrations, sending, payment reconciliation, WhatsApp automation or Lexpro import/sync in this phase.

## Burgess-Specific Rules

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
- Money must be stored in integer cents, not floating point values.
- VAT rules must remain configurable, and VAT overrides require a reason.
- Production migrations must not be run automatically by agents.
- Seed data must not contain real client data.
- Repository interfaces must not expose hard-delete methods for protected records.

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

## Engineering Rules

- Inspect the repo before final commands.
- Do not invent commands, frameworks, scripts or architecture that are not supported by the repo.
- If test/build/package commands are unavailable, mark them TODO.
- Prefer small, focused, deployable PRs.
- Use TDD first for business logic.
- Critical paths include auth, permissions, financial records, approval gates, document access, data mutations and agent actions.
- Aim for 90%+ coverage; critical paths should have 100% practical coverage.
- No disabled linting.
- No skipped tests without explicit justification.
- Every future feature needs tests and acceptance criteria.

## Context

Start with `.context/index.md`.

The `.context/` directory is the deeper source of truth. This file intentionally repeats critical rules so they remain visible even when context files are not loaded.

## Validation

Before review:

```sh
pnpm run pre-pr
```

Available package commands:

```sh
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:db
pnpm run test:coverage
pnpm run build
```

One-time hook setup:

```sh
git config core.hooksPath .githooks
```

Hooks must not call AI models.

## ADR Guidance

Create `docs/adr/` only when the first ADR is accepted/needed.

Recommend an ADR only when:

1. The decision is hard to reverse.
2. The decision would be surprising without context.
3. The decision came from a real trade-off.
