# Phase 2D Read-Only Client/Matter UI

Status: Complete
Date: 2026-06-22

## Summary

Add protected read-only client and matter pages connected to safe demo repository data through the Phase 2C service boundaries. The UI displays required placeholder operational fields without mutation controls or live database dependency.

## Scope

- Add `/admin/clients`.
- Add `/admin/matters`.
- Add `/admin/matters/[id]`.
- Add read-only client list, matter list and matter detail components.
- Add safe demo client/matter repositories for local UI display.
- Add UI read models that clearly label demo placeholder data.
- Add tests for required fields, demo labels and absence of active workflow actions.

## Non-Goals

- No edit forms.
- No delete buttons.
- No invoice creation.
- No statement creation.
- No document upload or download.
- No email or WhatsApp sending.
- No Lexpro import or sync.
- No payment reconciliation.
- No production auth or database wiring.

## Required Fields

- Account number.
- Client name/demo placeholder.
- Matter name and description.
- Matter type.
- Matter status.
- Next step due date.
- Responsible user placeholder.
- Latest invoice status placeholder.
- Latest statement balance placeholder.
- Last communication placeholder.
- Payment status placeholder.

## Acceptance Criteria

- Client and matter routes are protected by the existing admin access boundary.
- Matter list renders all required read-only fields.
- Matter detail renders all required read-only fields.
- Client list renders account number, demo client name, status and placeholder financial/payment fields.
- Demo data is clearly labelled.
- Agent service users remain blocked by the admin access boundary.
- No active edit, delete, send or approval controls are rendered.
- Normal validation does not require a running database.

## Validation

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm test`
- `pnpm run test:coverage`
- `pnpm run prisma:validate`
- `pnpm run build`
- `./scripts/check-agent-context.sh`
- `./scripts/check-adr-needed.sh`
- `./scripts/pre-pr-review.sh`
- `pnpm run test:db` only when local `DATABASE_URL` is available.

## Security And Privacy Review

- Auth/permissions impact: pages require the existing admin access boundary and service-layer reads.
- Customer data exposure risk: demo placeholder data only; no real Burgess client records.
- File/storage access risk: no document upload, download or storage access.
- Financial record impact: invoice, statement, balance and payment fields are placeholders only.
- Agent action impact: agent service users remain blocked from normal admin UI.
- Audit logging requirement: no sensitive mutation occurs in this phase.

## Risks

- Future real read models must preserve role filtering and avoid bypassing service-layer permission checks.
- Placeholder payment and statement fields must not be mistaken for reconciled Lexpro data.
