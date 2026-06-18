# Phase 1A: Auth, Roles, Permissions And Persistence Boundaries

Status: Accepted for implementation
Phase: 1A
Date: 2026-06-18

## Summary

Create the auth, role, permission, audit and persistence boundaries required before client files, matters, documents or financial records are implemented.

This phase proves the access-control model in tested domain code and adds only the Prisma foundation models needed for users, roles, permissions, audit logs and agent action traceability.

## Scope

- Add a provider-neutral auth boundary.
- Add Prisma foundation models for users, roles, user roles, permissions, role permissions, audit logs and agent actions.
- Add tested role/action permission policy.
- Add tested audit event definitions and audit writer boundary.
- Extend architecture guardrails for critical rule visibility.
- Update affected docs and context.

## Non-Goals

- No admin dashboard.
- No client or matter CRUD.
- No invoice UI.
- No statement UI.
- No WhatsApp automation.
- No Lexpro import/sync.
- No website pages.
- No marketing or outreach feature implementation.
- No production auth provider integration.
- No production database connection.
- No Prisma migration against a real database.

## Assumptions

- Auth provider remains a placeholder behind an interface until provider selection is accepted.
- Prisma 7 requires connection configuration outside `schema.prisma`; Phase 1A will use `prisma.config.ts`.
- Role permissions must be explicit, tested and server-side reusable.
- Agent service users remain draft-only.
- Audit records will eventually be persisted, but Phase 1A only creates the model and service boundary.

## Risks

- A future auth provider may need additional account/session models.
- Prisma 7 client generation can require package build-script approval in some environments.
- Role policy can become fragmented if future code bypasses the central permission service.
- Audit logging is only a boundary in this phase; persistence enforcement must be added in later service implementations.

## Implementation Steps

1. Confirm repo status and current validation baseline.
2. Add the Phase 1A plan.
3. Add Prisma 7-compatible config and foundation schema models.
4. Add auth provider-neutral interface and local/dev placeholder.
5. Add role/action permission policy.
6. Add audit event definitions and audit writer boundary.
7. Add permission, audit and architecture guardrail tests.
8. Update affected docs/context.
9. Run deterministic validation.
10. Commit the Phase 1A foundation.

## Validation

Run:

```sh
git status
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run build
./scripts/check-agent-context.sh
./scripts/check-adr-needed.sh
./scripts/pre-pr-review.sh
```

Also run:

```sh
pnpm exec prisma validate
```

## Rollback / Recovery

- Before commit: use Git to revert Phase 1A changes.
- After commit: use a normal revert commit.
- Do not remove Phase -1 or Phase 0 operating context.

## Acceptance Criteria

- Prisma schema validates with Phase 1A foundation models.
- Permission policy tests cover the mandatory role restrictions.
- Audit boundary tests cover required sensitive event categories.
- Auth provider decision remains isolated behind an interface.
- Architecture guardrail tests check `AGENTS.md`, `CLAUDE.md` and `.context/rules/operating-constraints.md`.
- Lint, typecheck, tests, coverage, build and pre-PR validation pass.
- No product features are implemented.

## Open Questions

- Which production auth provider will be used?
- Will support admins ever receive delegated approval permissions?
- How should auth sessions be persisted once the provider is selected?
- Which database environment will be used for local development and staging?
- Which audit records must be immutable at database level versus application level?

