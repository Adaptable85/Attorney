# Architecture Index

No application architecture is implemented in Phase -1.

## Phase 0 Architecture Work

Phase 0 should define:

- Application framework.
- Runtime language.
- Database.
- Auth approach.
- Permission model.
- Test harness.
- Data model.
- Audit model.
- File storage approach.
- Deployment model.
- ADRs for hard-to-reverse decisions.

## Current Confirmed Boundaries

- Burgess platform: source of truth for invoices and client-facing statement PDFs.
- Lexpro: source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.
- Invoice numbers: assigned only on owner/principal approval.
- Agent: draft-only service user by default.

## ADR Candidates

Create `docs/adr/` only when the first ADR is accepted/needed.

Known future ADR candidates:

- Burgess platform source of truth for invoices and client-facing statement PDFs.
- Lexpro retained for legal/trust accounting and reconciled payment records.
- Invoice number assigned only on owner/principal approval.
- Hosting choice.
- File storage choice.
- WhatsApp integration choice.
- Email integration choice.

