# AGENTS.md

This repository is for the Burgess Attorneys Admin Automation Platform.

## Current Phase Boundary

Phase 4F adds a Microsoft Entra JWT/JWKS verification boundary skeleton only. It adds no live OAuth exchange, Microsoft redirect, network call to Microsoft by default, session cookie creation, real provider secrets, production auth readiness, production writes, live UI save, active production save button, mutation API route, deployment or production database operation.

Do not build product features yet. Do not build client/matter CRUD, invoice workflow, statement workflow, WhatsApp automation, Lexpro import, website, marketing system, outreach system, production auth, production database models, production file storage, or agent runtime yet.

Phase 1A adds only auth, role, permission, audit and persistence boundaries.
Phase 1B adds no UI and no sending/storage implementation.
Phase 1C adds no UI, PDF generation, sending, payment reconciliation, WhatsApp automation or Lexpro import/sync.
Phase 1D adds no production database migration execution and no real database wiring.
Phase 1E adds local development database wiring only. It adds no production migration execution and no product features.
Phase 2A adds no CRUD, no real dashboard data, no protected workflow actions and no production auth.
Phase 2B adds read-only admin dashboard placeholders only. It adds no real dashboard data, CRUD, protected workflow actions, production auth, sending or sync.
Phase 2C adds client/matter service boundaries only. It adds no delete endpoints, UI CRUD, invoice/statement endpoints, production auth, production DB dependency, sending or sync.
Phase 2D adds read-only client/matter UI with safe demo data only. It adds no edit/delete actions, invoice/statement creation, document upload/download, sending, payment reconciliation or sync.
Phase 2E adds disabled client/matter form foundations only. It adds no submit/save action, server action, API route, persistence, document upload, invoice/statement generation, sending or sync.
Phase 3A adds auth/session hardening and audited persistence enablement only. It adds no production auth secrets, live UI saves, API mutation routes, production DB commands, deployment, sending or sync.
Phase 3B adds local-only Prisma client/matter repository adapters and guarded DB tests only. It adds no live UI saves, API mutation routes, production DB commands, migrations, deployment, sending or sync.
Phase 3C adds audited transaction boundary preparation only. It adds no live UI saves, API mutation routes, production DB commands, migrations, deployment, sending or sync.
Phase 3D adds local/dev audited persistence service composition only. It adds no live UI saves, API mutation routes, server action writes, production DB commands, migrations, deployment, sending or sync.
Phase 3E adds production auth design, mutation entrypoint design, default-off release gates and a service-layer mutation gate only. It adds no production auth provider, production auth secrets, live UI saves, server action writes, API mutation routes, production DB commands, migrations, deployment, sending or sync.
Phase 3F adds production auth adapter/readiness boundaries and disabled client/matter mutation skeletons only. It adds no real provider setup, production auth secrets, live UI saves, active server action writes, API mutation routes, production DB commands, migrations, deployment, sending or sync.
Phase 3G adds dev-only client/matter mutation functions behind explicit local/dev gates only. It adds no production auth provider, production auth secrets, live UI saves, active production save button, API mutation routes, production DB commands, migrations, deployment, sending or sync.
Phase 3H adds safe local DB validation documentation, guarded local DB scripts and dev/staging readiness checklist only. It adds no production auth provider, production auth secrets, live UI saves, active production save button, API mutation routes, production DB commands, production migrations, deployment, sending or sync.
Phase 3J adds production auth provider comparison, recommendation and implementation-plan documentation only. It adds no real provider setup, production auth secrets, live UI saves, active production save button, API mutation routes, production DB commands, production migrations, deployment, sending or sync.
Phase 3K.1 accepts Microsoft Entra ID / Microsoft 365 identity as the production auth provider direction only. It adds no provider integration, secrets, production auth readiness, live UI saves, active production save button, API mutation routes, production DB commands, production migrations, deployment, sending or sync.
Phase 4A adds Entra config parsing, issuer helpers, claim mapping and adapter skeletons only. It adds no live login, token exchange, session creation, real secrets, production auth readiness, live UI saves, active production save button, API mutation routes, production DB commands, production migrations, deployment, sending or sync.
Phase 4B adds disabled Entra login/callback/logout placeholders, staging setup docs and callback/session design only. It adds no Microsoft redirects, token exchange, session cookies, real secrets, production auth readiness, live UI saves, active production save button, mutation API routes, production DB commands, production migrations, deployment, sending or sync.
Phase 4C adds OAuth state/nonce helpers, PKCE helpers, Entra JWKS descriptors and token-validation skeletons only. It adds no Microsoft redirects, token exchange, JWKS fetch, cryptographic token acceptance, session cookies, real secrets, production auth readiness, live UI saves, active production save button, mutation API routes, production DB commands, production migrations, deployment, sending or sync.
Phase 4D adds OAuth state storage and JWKS metadata cache boundaries only. It adds no Microsoft redirects, token exchange, default JWKS network fetch, cryptographic token acceptance, session cookies, real secrets, production auth readiness, live UI saves, active production save button, mutation API routes, production DB commands, production migrations, deployment, sending or sync.
Phase 4E adds disabled-by-default Entra staging dependency wiring only. It adds no route enablement, Microsoft redirects, token exchange, default JWKS network fetch, cryptographic token acceptance, session cookies, real secrets, production auth readiness, live UI saves, active production save button, mutation API routes, production DB commands, production migrations, deployment, sending or sync.
Phase 4F adds Entra JWT/JWKS verifier interfaces, key-selection rules and fake/local verifier tests only. It adds no route enablement, Microsoft redirects, token exchange, default JWKS network fetch, session cookies, real secrets, production auth readiness, live UI saves, active production save button, mutation API routes, production DB commands, production migrations, deployment, sending or sync.

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
- Money must be stored in integer cents, not floating point values.
- VAT rules must remain configurable, and VAT overrides require a reason.
- Production migrations must not be run automatically by agents.
- Seed data must not contain real client data.
- Repository interfaces must not expose hard-delete methods for protected records.
- Mutation-capable services must require authenticated actor context, permission checks and audit metadata before repository writes.
- Local Prisma repository adapters must not be wired to UI saves or production database operations until production auth and transaction/outbox behavior are explicitly accepted.
- Future live persistence must use an injected transaction boundary so audit recording and repository mutation commit or fail together.
- Local/dev service composition must not be imported by app UI routes or used as production persistence.
- Client/matter write release gates must default off and must require production-auth readiness before production writes are enabled.
- Future server actions or API mutation routes must pass production-compatible principal, role, service context, permission, audit metadata, transaction boundary and release gate checks before service mutation code can run.
- Production auth readiness must fail closed unless an accepted production provider is explicitly configured.
- Disabled mutation skeletons must not be wired to UI, app routes, Prisma adapters or local/dev composition.
- Dev-only write paths must require explicit local/dev flags, local/dev composition and fake `DEMO-*` account numbers.
- Production writes must remain blocked unless production auth readiness and explicit production write approval are configured.
- Local DB tests must use local PostgreSQL and the guarded `burgess_attorneys_dev` database only.
- Microsoft Entra ID / Microsoft 365 identity is the accepted production auth provider direction, but implementation, secrets, production auth readiness and production writes remain blocked until approved validation is complete.

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
pnpm run test:db
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
