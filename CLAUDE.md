# CLAUDE.md

This repository is for the Burgess Attorneys Admin Automation Platform.

## Standing Instruction

Work safely, locally and deterministically. Do not assume missing frameworks, commands, APIs, hosting, financial rules, Lexpro capabilities, WhatsApp provider details, email provider details, or storage architecture.

Phase 2A is a protected, role-aware admin shell UI with placeholder module cards only. Phase 2B adds a read-only dashboard overview with safe demo placeholder data only. Phase 2C adds client/matter service boundaries only. Phase 2D adds read-only client/matter UI only. Phase 2E adds disabled client/matter form foundations only. Phase 3A adds auth/session hardening and audited persistence enablement only. Phase 3B adds local-only Prisma client/matter repository adapters and guarded DB tests only. Phase 3C adds audited transaction boundary preparation only. Phase 3D adds local/dev audited persistence service composition only. Phase 3E adds production-auth gating and server-action/API mutation design only. Phase 3F adds a production-auth adapter boundary and disabled mutation entrypoint skeletons only. Phase 3G adds dev-only client/matter mutation functions behind explicit local/dev gates only. Phase 3H adds safe local DB validation documentation and dev/staging readiness checklist only. Phase 3J adds a production auth provider decision pack only. Phase 3K.1 records Microsoft Entra ID / Microsoft 365 identity as the accepted production auth provider direction only. Phase 4A adds an Entra auth implementation skeleton only. Phase 4B adds disabled Entra auth route placeholders and callback/session design only. Phase 4C adds OAuth security skeletons only. Phase 4D adds OAuth storage/cache boundaries only. Phase 4E adds disabled-by-default Entra staging wiring only. Phase 4F adds an Entra JWT/JWKS verification boundary skeleton only. Phase 4G selects `jose` and adds a non-live verifier adapter only. Phase 4H adds staging callback/JWKS fetch-cache design only. Phase 5A adds production hosting/environment decision documentation only. Phase 5B accepts Vercel + Neon hosting/database direction only. Phase 5C adds Vercel/Neon staging setup plans and environment templates only. Phase 5D adds a staging resource creation runbook and approval checklist only. Phase 5G accepts Supabase Postgres as the managed PostgreSQL direction replacing Neon only. Phase 5I accepts Railway + Railway Postgres as the staging direction only. Phase 8A adds a read-only admin review workspace and section-by-section review structure only. Phase 8C adds a read-only Clients Review module and demo-only client detail previews only. Do not create active production client/matter UI CRUD, invoice workflows, statement workflows, live login, Microsoft redirects, default JWKS network fetches, production auth secrets, production auth readiness, production migrations, deployment, sending, payment gateway, Yoco, Payfast, shop, checkout, membership, payment reconciliation, WhatsApp automation or Lexpro import/sync in these phases.

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
- Microsoft Entra callback/JWKS fetch-cache design remains documentation-only until a live-auth phase explicitly accepts route enablement, network fetch, token exchange, session and audit wiring.
- Production hosting, production database, DNS, backup and deployment approvals remain pending after Phase 5A.
- Railway + Railway Postgres is accepted as the staging hosting/database direction after ADR 0011. ADR 0011 supersedes the active Vercel + Supabase staging direction, but resource creation, deployment, live auth, UI saves and production writes remain blocked until explicit approval.
- Phase 5C staging setup templates do not approve provider resource creation, secrets, deployment, live auth, UI saves or production writes.
- Phase 5D staging resource runbook does not approve provider resource creation, secrets, deployment, database commands, live auth, UI saves or production writes.
- Vercel/Supabase and Vercel/Neon documents remain historical unless later re-approved.
- Phase 8A admin review pages must remain private, read-only and demo/placeholder-only. They must not expose public admin links, active save/create/submit buttons, payment gateway copy, Yoco, Payfast, shop or checkout functionality.
- Phase 8C Clients Review pages must remain private, read-only and demo-only. They must not expose real client data entry, public admin links, active save/create/edit/archive/upload/submit buttons, payment gateway copy, Yoco, Payfast, shop, checkout or membership functionality.

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
