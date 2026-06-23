# Phase 2C Client/Matter Service Boundaries

Status: Complete
Date: 2026-06-22

## Summary

Add server-side client and matter service boundaries for future admin workflows. This phase keeps the boundary database-agnostic in normal tests by using repository interfaces and fakes, and it does not expose API route handlers or UI mutation surfaces.

## Scope

- Add typed service result helpers.
- Add client list, detail and create service functions.
- Add matter list, detail and create service functions.
- Reuse existing auth/admin access and role permission policies.
- Return safe typed errors instead of raw exceptions.
- Add tests for listing, create permission boundaries, validation failures and no hard-delete service exports.

## Non-Goals

- No public or admin API route handlers yet.
- No client or matter UI.
- No delete endpoints.
- No document upload/download.
- No invoice or statement endpoints.
- No WhatsApp automation.
- No Lexpro import or sync.
- No production auth provider.
- No production database dependency.

## Acceptance Criteria

- Owner/principal, support admin and read-only reviewer users can list client/matter summaries through service functions.
- Agent service users cannot list through normal admin service functions.
- Owner/principal and support admin users can create clients/matters through the service boundary.
- Read-only reviewer and agent service users cannot create clients/matters.
- Invalid input returns safe validation errors without raw stack traces.
- Missing records return typed not-found errors.
- Service modules expose no hard-delete operation.
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

- Auth/permissions impact: service functions require admin shell access and create permissions.
- Customer data exposure risk: tests use deterministic fake fixtures only.
- File/storage access risk: no document storage operations.
- Financial record impact: no invoice, statement, payment or correction operations.
- Agent action impact: agent service users cannot list or create client/matter records through the normal admin service boundary.
- Audit logging requirement: create calls include an actor context and reason for future repository audit wiring; no audit persistence is added in this phase.

## Risks

- Future API route handlers must not bypass these service functions.
- Future persistence adapters must connect create/update operations to audit logging before real operational use.
