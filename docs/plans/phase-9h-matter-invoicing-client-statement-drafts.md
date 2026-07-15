# Phase 9H: Matter Invoicing and Client Statement Drafts

Date: 2026-07-15

## Status

Implemented.

## Scope

Phase 9H adds Railway-staging draft invoicing inside saved matters:

- Matter pages can add draft billing lines when
  `BURGESS_STAGING_MATTER_INVOICES_ENABLED=true`.
- Matter pages can create draft invoices from uninvoiced draft billing lines.
- Draft invoices use internal draft references only and have no official invoice
  number.
- Client file statement panels show draft statement lines pulled from matter
  draft invoices.

## Non-Scope

This phase does not approve invoices, assign official invoice numbers, generate
PDFs, send invoices or statements, process payments, call LLMs, sync Lexpro,
enable WhatsApp, enable live Microsoft Entra auth or enable production writes.

## Data Model

No schema change or migration is required. Existing models are used:

- `BillingLineItem`
- `Invoice`
- `InvoiceLine`
- `StatementSnapshot`
- `StatementLine`
- `AuditLog`
- `TimelineEvent`

## Safety

- No `db:push`.
- No schema migration.
- No production database command.
- No production writes.
- No invoice approval.
- No statement sending.
- No official invoice number assignment.
- Money remains integer cents.

## Validation

Required validation:

```sh
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run prisma:validate
pnpm run build
./scripts/check-agent-context.sh
./scripts/check-adr-needed.sh
./scripts/pre-pr-review.sh
```

## Smoke Plan

After deployment to Railway staging:

1. Sign in to admin.
2. Open a disposable staging matter.
3. Add one draft billing line.
4. Create one draft invoice.
5. Confirm the invoice has no official invoice number.
6. Open the client file statement panel.
7. Confirm the draft invoice appears as a draft statement line.
