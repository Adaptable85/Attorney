# Phase 2B Read-Only Admin Dashboard

Status: Complete
Date: 2026-06-22

## Summary

Add a protected read-only dashboard overview for the Burgess Attorneys admin shell. The dashboard uses clearly labelled demo placeholder data only and introduces no mutation, sending, approval, import, sync or production data dependency.

## Scope

- Add `/admin/dashboard` behind the existing admin access boundary.
- Add a pure dashboard model with role-filtered placeholder sections.
- Add read-only dashboard presentation components.
- Add tests for demo-data safety, role filtering and absence of workflow controls.
- Update architecture and context docs for Phase 2B.

## Non-Goals

- No client or matter CRUD.
- No invoice approval controls.
- No statement approval controls.
- No email or WhatsApp sending.
- No Lexpro import or sync.
- No payment reconciliation.
- No production auth provider.
- No database dependency for normal validation.

## Dashboard Sections

- Open matter visibility placeholder.
- Upcoming next steps placeholder.
- Pending approval placeholders for owner/principal users only.
- Support-safe preparation placeholders.
- Recent audit/timeline placeholder.
- Agent draft queue placeholder.
- Lexpro/accounting boundary reminder.

## Acceptance Criteria

- Dashboard route is protected by the existing admin shell access boundary.
- Dashboard model uses fake/demo labels only.
- Owner/principal users can see pending approval placeholders.
- Support admin users do not see owner-only approval placeholders or controls.
- Agent service users cannot access dashboard model content.
- Dashboard exposes no create, edit, delete, send, publish or approval actions.
- Lexpro boundary reminder is visible.
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

- Auth/permissions impact: uses existing admin access helper and role-filtered dashboard sections.
- Customer data exposure risk: demo placeholder data only; no real client or matter records.
- File/storage access risk: no upload, download or storage access.
- Financial record impact: pending approval counts are fake placeholders and expose no actions.
- Agent action impact: agent service users remain blocked from normal admin shell/dashboard access.
- Audit logging requirement: no sensitive mutation occurs in this phase.

## Risks

- Demo values could be mistaken for live metrics if labels are removed in later edits.
- Future dashboard data wiring must preserve server-side permission checks and avoid exposing owner-only workflow controls to support users.
