# 0002: Invoice And Statement Source-Of-Truth Boundary

Status: Accepted
Date: 2026-06-18

## Context

The platform must support invoicing and client-facing statement PDFs, while Lexpro remains necessary for legal/trust accounting, bookkeeping, reconciled payments and compliance records.

## Decision

The Burgess platform is the source of truth for invoices and client-facing statement PDFs.

Lexpro remains the source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.

## Consequences

- Invoice and statement workflows can be designed around owner approval and audit history.
- Payment and accounting reconciliation must respect Lexpro as the accounting/compliance authority.
- Future Lexpro sync/import must not silently overwrite approved Burgess financial records.

