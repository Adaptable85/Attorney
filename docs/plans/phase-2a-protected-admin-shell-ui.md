# Phase 2A Protected Admin Shell UI

Status: Complete
Date: 2026-06-18

## Summary

Create a protected, role-aware internal admin shell for Burgess Attorneys. The shell is a safe placeholder surface for future legal-admin, billing, approvals, audit and integration work.

## Scope

- Add `/admin` shell route.
- Add explicit admin access helper using the existing auth boundary and permission policy.
- Add role-filtered placeholder navigation.
- Add placeholder module cards only.
- Add tests for access, navigation and placeholder safety.

## Non-Goals

- No client or matter CRUD.
- No dashboard data.
- No invoice or statement workflow.
- No PDF generation.
- No email, WhatsApp, Lexpro sync, payment reconciliation, marketing or outreach implementation.
- No production auth provider.
- No Prisma schema changes.
- No real document upload or download.

## Assumptions

- Existing role keys remain `OWNER_PRINCIPAL`, `SUPPORT_ADMIN`, `AGENT_SERVICE` and `READ_ONLY_REVIEWER`.
- Existing permission policy remains the source of truth for role capability filtering.
- Local/dev auth may use an explicit placeholder principal.
- Normal validation must not require a running database.

## Risks

- Placeholder UI could be mistaken for implemented workflows if labels are unclear.
- Local dev auth could be confused with production auth if not labelled.
- Support/admin navigation could accidentally expose owner-only approval affordances.

## Implementation Steps

1. Add admin access and current-user helpers.
2. Add admin navigation/module definitions filtered by role permissions.
3. Add admin shell components with semantic headings and clear placeholder status.
4. Add `/admin` route and not-authorized page.
5. Add tests for admin access, nav filtering and placeholder rendering.
6. Update architecture/context docs.
7. Run deterministic validation and commit.

## Validation

- `git status`
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

## Rollback / Recovery

Revert the Phase 2A commit to remove the shell, auth helpers, tests and documentation changes. No database schema or production data changes are expected.

## Acceptance Criteria

- Owner/principal and support admin can access the admin shell.
- Agent service user is blocked from normal admin shell access.
- Missing user is handled safely.
- Support admin does not see owner-only approval placeholders.
- Agent service user receives no admin navigation.
- Module cards clearly say `Not implemented yet` and `Coming in later phase`.
- No real client, matter, document or financial data is shown.
- Normal validation does not require a running database.

## Open Questions

- Which production auth provider will be selected?
- Which hosting/runtime will serve the protected admin app?
- Which exact modules should become real first after shell approval?
