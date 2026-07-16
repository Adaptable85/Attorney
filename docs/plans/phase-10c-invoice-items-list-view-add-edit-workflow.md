# Phase 10C: Invoice Items List View With Add/Edit Workflow

Date: 2026-07-16

## Summary

Phase 10C converts `/admin/invoice-items` from large cards into a compact billing-item register. Reusable invoice items remain staging-only templates that feed matter billing dropdowns.

## Implemented Scope

- Invoice Items renders a searchable table/list.
- The page includes an `Add Invoice Item` action and focused add panel.
- Each row includes an `Edit` action linked to a compact edit panel.
- Existing create and update routes remain unchanged.
- The page remains read-only/disabled when the database or billing item gate is unavailable.

## Safety Boundary

- No schema change.
- No migration.
- No `db:push`.
- No production write.
- No live Microsoft Entra auth.
- No invoice approval, official invoice numbering, PDF generation, sending, payment, WhatsApp, Lexpro sync or LLM action.

## Validation

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm test`
- `pnpm run test:coverage`
- `pnpm run prisma:validate`
- `pnpm run build`
- `./scripts/check-agent-context.sh`
- `./scripts/check-adr-needed.sh`
- `./scripts/pre-pr-review.sh`
