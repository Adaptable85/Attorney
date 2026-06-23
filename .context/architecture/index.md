# Architecture Index

Phase 0 architecture foundation is implemented.
Phase 1A auth, role, permission, audit and persistence boundaries are implemented.
Phase 1B client, matter, document metadata and timeline persistence foundations are implemented.
Phase 1C billing, invoice, statement and financial correction foundations are implemented.
Phase 1D migration strategy, repository interfaces, Prisma boundary and fake seed fixtures are implemented.
Phase 1E local migration execution, Prisma Client generation and a minimal users/roles repository adapter are implemented.
Phase 2A protected admin shell UI and role-aware placeholder navigation are implemented.
Phase 2B read-only admin dashboard overview with safe demo placeholder data is implemented.
Phase 2C client/matter service boundaries are implemented without API routes or database-dependent normal tests.
Phase 2D read-only client/matter UI is implemented with safe demo data through service boundaries.
Phase 2E disabled client/matter create form foundations are implemented without persistence.
Phase 3A auth/session hardening and audited persistence enablement are implemented without live UI saves.
Phase 3B local-only Prisma client/matter repository adapters and guarded DB integration tests are implemented without live UI saves or production database operations.
Phase 3C audited transaction boundary is implemented without live UI saves or production database operations.
Phase 3D local/dev client-matter service composition is implemented without live UI saves or production database operations.
Phase 3E production-auth gating and server-action/API mutation design is implemented without live write entrypoints.
Phase 3F production-auth adapter boundary and disabled mutation entrypoint skeletons are implemented without live write entrypoints.
Phase 3G dev-only client/matter write path is implemented for backend tests without production writes or UI saves.
Phase 3H safe local DB validation documentation and dev/staging readiness checklist are implemented without production writes or UI saves.
Phase 3J production auth provider decision pack is implemented without provider integration, production secrets, production writes or UI saves.
Phase 3K.1 Microsoft Entra ID / Microsoft 365 identity decision ADR is accepted without provider integration, production secrets, production auth readiness, production writes or UI saves.

## Current Direction

- TypeScript.
- Next.js App Router.
- Modular monolith.
- PostgreSQL-ready architecture.
- Prisma ORM direction.
- Zod boundary validation.
- Server-side service/domain modules.
- Vitest for unit/service tests.
- Provider-neutral auth boundary.
- Prisma foundation models for users, roles, permissions, audit logs and agent actions.
- Tested role permission policy.
- Tested audit event boundary.
- Prisma foundation models for clients, contacts, matters, assignments, notes, document metadata and timeline events.
- Tested client/matter/document/timeline domain helpers.
- Prisma foundation models for billing line items, invoices, invoice approvals, invoice number sequences, statement snapshots, statement approvals and financial correction records.
- Tested money, VAT, invoice approval, statement approval and financial correction helpers.
- Reviewed migration strategy and ADR.
- Repository interfaces with protected-record boundaries.
- Dev-only seed skeleton and deterministic fake fixtures.
- Local-only development migration path.
- Guarded fake users/roles seed writes.
- Database integration tests isolated behind `pnpm run test:db`.
- Protected `/admin` shell route with placeholder-only cards.
- Local/dev auth boundary for shell protection; production auth remains unresolved.
- Protected `/admin/dashboard` route with read-only, role-filtered demo placeholder sections.
- Client/matter service functions wrap repository interfaces with admin access checks and safe typed errors.
- Protected `/admin/clients`, `/admin/matters` and `/admin/matters/[id]` read-only pages use safe demo repositories.
- Protected `/admin/clients/new` and `/admin/matters/new` render disabled future-phase form foundations only.
- Auth sessions map through fail-closed role mapping before becoming domain principals.
- Mutation-capable service functions require service context, permission checks and audit metadata.
- Local-only Prisma client/matter repository adapters can be exercised through guarded DB tests.
- Audited mutations can run audit recording and repository mutation through an injected transaction boundary.
- ADR 0006 records AuditLog as the immediate internal outbox-equivalent; a separate outbox table is deferred.
- Local/dev service composition wires Prisma client/matter/audit repositories and transaction boundary for backend-only tests.
- Client/matter write feature and release gates default off.
- Future mutation entrypoints must pass production-compatible principal, service context, permission, audit metadata, transaction boundary and release-gate checks before service mutation code runs.
- Production auth adapter/readiness boundary exists, and Microsoft Entra ID / Microsoft 365 identity is the accepted provider direction.
- Disabled client/matter mutation skeletons exist as server modules only and remain unwired from UI/routes.
- Dev-only client/matter mutation functions exist behind explicit local/dev gates and local/dev composition.
- Dev-only mutation functions require fake `DEMO-*` account numbers.
- Dev/staging readiness checklist lives at `docs/architecture/dev-staging-readiness-checklist.md`.
- Local DB helper scripts target only `localhost` and `burgess_attorneys_dev`.
- Production auth provider decision pack lives at `docs/architecture/production-auth-provider-decision-pack.md`.
- Accepted auth direction is Microsoft Entra ID / Microsoft 365 identity, pending tenant/admin access confirmation, MFA policy, role claim approach, environment configuration, staging validation and production readiness review.

See:

- `docs/architecture/technical-architecture.md`
- `docs/architecture/domain-model.md`
- `docs/adr/`

## Current Confirmed Boundaries

- Burgess platform: source of truth for invoices and client-facing statement PDFs.
- Lexpro: source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.
- Invoice numbers: assigned only on owner/principal approval.
- Agent: draft-only service user by default.
- Client documents: metadata only in Phase 1B and private by default.
- Money: integer cents only.
- Invoice numbers: nullable until owner/principal approval.
- Statements: snapshots, not live mutable views.
- Production migrations: never run automatically by agents.
- Seed data: fake only, no real client data.
- Normal pre-PR checks: must not require a running database.
- Admin shell: placeholder only, no CRUD or protected workflow actions.
- Admin dashboard: demo placeholder data only, no live counts or workflow actions.
- Client/matter services: no hard-delete operation, no API route exposure yet, and no normal-test database dependency.
- Client/matter UI: read-only demo display only, no edit/delete/send/approve actions.
- Client/matter form foundations: disabled only, no submit action or persistence.
- Audited persistence enablement: service boundary only; forms remain disabled and no live database write is exposed.
- Phase 3B Prisma adapters: local repository boundary only; no UI save, API mutation route or production DB operation is exposed.
- DB-specific tests: isolated behind `pnpm run test:db` and guarded to local `burgess_attorneys_dev`.
- Phase 3C transaction boundary: service-layer preparation only; no UI save, server action, API mutation route or production DB operation is exposed.
- Phase 3D local/dev composition: backend test composition only; app UI routes must not import it.
- Phase 3E mutation gating: design/helper only; no server action, API mutation route, live UI save, production auth provider, migration or production DB operation is exposed.
- Phase 3F disabled skeletons: server-module tests only; no UI wiring, active server action, API mutation route, live save, migration or production DB operation is exposed.
- Phase 3G dev-only writes: backend mutation functions only; no UI save, active production save button, API mutation route, production auth provider, migration or production DB operation is exposed.
- Phase 3H local DB validation: docs/scripts/checklist only; DB tests require local PostgreSQL and remain optional/guarded.
- Phase 3J auth decision pack: docs only; no provider integration, secrets, login flow, production write or UI save is exposed.
- Phase 3K.1 auth decision ADR: Microsoft Entra ID / Microsoft 365 identity accepted as direction only; no provider integration, secrets, production auth readiness, production write or UI save is exposed.
- Agent service users: blocked from normal admin shell navigation.

## ADR Candidates

`docs/adr/` exists because Phase 0 accepted the first ADRs.

Known future ADR candidates:

- Burgess platform source of truth for invoices and client-facing statement PDFs.
- Lexpro retained for legal/trust accounting and reconciled payment records.
- Invoice number assigned only on owner/principal approval.
- Hosting choice.
- File storage choice.
- WhatsApp integration choice.
- Email integration choice.
