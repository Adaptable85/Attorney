# Phase 10B: Simplify Admin to Client Files, Matters and Invoice Items

Date: 2026-07-16

## Summary

Phase 10B simplifies the protected staging admin workflow around the Burgess working model:

1. Start in Client Files.
2. Keep client overview and general client documents in the client file.
3. Open matters inside the client file.
4. Keep matter documents, notes / timeline, billing and draft invoices inside the matter.
5. Pull matter draft invoices into the client statement.
6. Maintain reusable Invoice Items from the left sidebar and select them inside matter billing.

## Implemented Scope

- Normal admin navigation now shows only Files and Invoice Items.
- Client file detail now focuses on Overview, General Documents, Matters and Statement.
- Matter detail now focuses on Overview, Matter Documents, Notes / Voice Notes, Billing and Draft Invoices.
- Reusable active invoice item templates load into the matter billing form as a dropdown.
- Selecting a reusable item prefills editable billing fields while preserving manual entry.
- Server-side matter billing creation remains unchanged and still validates explicit posted fields behind the existing staging invoice gate.

## Safety Boundary

- No schema changes.
- No migration.
- No `db:push`.
- No production database command.
- No production write gate.
- No live Microsoft Entra auth.
- No invoice approval.
- No official invoice number assignment.
- No PDF generation.
- No invoice or statement sending.
- No LLM action, WhatsApp automation, Lexpro sync, Yoco, Payfast, shop, checkout or payment behavior.

## Validation Plan

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm test`
- `pnpm run test:coverage`
- `pnpm run prisma:validate`
- `pnpm run build`
- `./scripts/check-agent-context.sh`
- `./scripts/check-adr-needed.sh`
- `./scripts/pre-pr-review.sh`
