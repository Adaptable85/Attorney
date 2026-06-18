# Architecture Index

Phase 0 architecture foundation is implemented.
Phase 1A auth, role, permission, audit and persistence boundaries are implemented.
Phase 1B client, matter, document metadata and timeline persistence foundations are implemented.
Phase 1C billing, invoice, statement and financial correction foundations are implemented.
Phase 1D migration strategy, repository interfaces, Prisma boundary and fake seed fixtures are implemented.

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
