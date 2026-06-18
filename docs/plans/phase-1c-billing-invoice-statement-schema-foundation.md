# Phase 1C: Billing, Invoice And Statement Schema Foundation

Status: Accepted for implementation
Phase: 1C
Date: 2026-06-18

## Summary

Create the financial domain foundation for draft billing line items, invoice approval boundaries, invoice numbering rules, statement snapshots and financial correction records.

This phase adds schema, domain helpers and tests only. It does not build UI, PDF generation, sending, WhatsApp automation, Lexpro import/sync, payment reconciliation, marketing or outreach.

## Scope

- Add Prisma financial foundation models and enums.
- Store money as integer cents with currency fields.
- Add billing line item validation and VAT defaulting rules.
- Add draft invoice validation and approval payload helpers.
- Add statement snapshot validation and approval payload helpers.
- Add financial correction payload helpers.
- Extend permission policy for financial actions.
- Extend audit event categories for financial actions.
- Add architecture guardrails for money fields and financial rules.

## Non-Goals

- No invoice screens.
- No statement screens.
- No dashboard UI.
- No PDF generation.
- No email/WhatsApp sending.
- No Lexpro import/sync.
- No payment reconciliation.
- No production migration.
- No storage provider work.

## Assumptions

- Burgess platform is source of truth for invoices and client-facing statement PDFs.
- Lexpro remains source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.
- Draft invoices use internal draft references only.
- Official invoice numbers are assigned only on owner/principal approval.
- VAT applies to fees by default and not to disbursements by default.
- VAT treatment remains configurable and overrides require a reason.
- Approved financial records require correction records; they are not silently overwritten.

## Risks

- Future invoice numbering rules may require firm-specific sequence partitioning.
- Future VAT/disbursement rules may need additional configuration tables.
- Future payment sync may require links to Lexpro identifiers.
- Statement snapshot design may need more detail once sample statements are reviewed.

## Implementation Steps

1. Confirm clean Git status.
2. Add Phase 1C plan.
3. Extend Prisma schema with financial foundation models and enums.
4. Add financial permission actions and policy helpers.
5. Add financial audit event types.
6. Add money, billing, invoice, statement and correction domain helpers.
7. Add focused tests.
8. Extend architecture guardrails.
9. Update affected docs/context.
10. Run deterministic validation.
11. Commit Phase 1C.

## Validation

Run:

```sh
git status
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

## Rollback / Recovery

- Before commit: revert Phase 1C files with Git.
- After commit: use a normal revert commit.
- Do not remove accepted Phase -1, Phase 0, Phase 1A or Phase 1B foundations.

## Acceptance Criteria

- Prisma schema validates.
- Financial models store money in integer cents, not floats.
- Draft invoices cannot have official invoice numbers.
- Owner approval is required for invoice/statement approval.
- Invoice number assignment is approval-controlled.
- Approved financial records require correction records.
- VAT defaults and overrides are tested.
- Audit event types include billing/invoice/statement/correction/VAT events.
- Full pre-PR validation passes.

## Open Questions

- Exact invoice number sequence format.
- Whether invoice number sequences reset annually, monthly or never.
- Final VAT configuration UI/data source.
- Final statement PDF snapshot layout.
- How future Lexpro payment records will reference invoices/statements.

