# Phase 3G Dev-Only Client Matter Write Path

Status: Implemented for review
Date: 2026-06-23

## Summary

Phase 3G adds an explicitly gated dev-only client/matter write path for backend testing. The path uses the mutation gate, local/dev service composition, audited service functions and transaction boundaries. It remains unwired from UI forms and cannot enable production writes.

## Scope

- Harden write feature flags for local/dev and production separation.
- Add explicit dev mutation entrypoint gate.
- Add dev-only client and matter mutation functions.
- Keep existing disabled action skeletons.
- Add normal tests proving default-blocked and explicit-dev-enabled behavior.
- Add guarded DB-only tests for local/dev end-to-end writes and audit logs.
- Keep create forms disabled and update docs/context.

## Non-Goals

- No production writes.
- No production auth provider secrets.
- No live UI save.
- No active production save button.
- No API mutation route.
- No deploy.
- No `db:push`.
- No production migration.
- No invoice, statement, PDF, email, WhatsApp, Lexpro, payment reconciliation, website, marketing or outreach behavior.
- No hard-delete methods.

## Assumptions

- Production auth provider is still pending.
- Local/dev service composition is the only accepted persistence path for Phase 3G.
- Dev-only records must use fake `DEMO-*` account numbers.
- DB tests run only when `DATABASE_URL` is safe local/dev.

## Risks

- Dev-only mutation functions must not be wired to production UI or route handlers by accident.
- Local DB integration tests leave only archived fake records when cleanup paths run.
- Future production writes still need provider selection, release approval and security review.

## Implementation Steps

1. Add explicit `devMutationEntrypointsEnabled` and `productionWritesEnabled` flags.
2. Require production writes to pass production auth readiness and production write enablement.
3. Require local/dev writes to pass local/dev write and dev mutation entrypoint enablement.
4. Add `createClientMutation` and `createMatterMutation` dev-only functions.
5. Require mutation gate, service context, audit metadata and transaction boundary.
6. Require fake `DEMO-*` account numbers.
7. Add normal tests with fake composition.
8. Add DB-only tests behind the local database guard.
9. Update guardrails and docs/context.

## Validation

Required normal validation:

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

DB validation:

```sh
pnpm run test:db
```

Run DB validation only when `DATABASE_URL` is set and accepted as local/dev.

## Rollback / Recovery

- Revert the Phase 3G commit.
- Disable `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED` and `BURGESS_LOCAL_DEV_WRITES_ENABLED`.
- No schema changes, migrations, production routes or production writes are part of this phase.

## Acceptance Criteria

- All write gates default off.
- Production environment cannot use local/dev write gates.
- Explicit local/dev flags do not imply production writes.
- Owner/support dev writes work only when explicit local/dev gates and composition are provided.
- Agent/read-only users remain blocked.
- Missing audit metadata and transaction dependency fail closed.
- Real-looking account numbers are rejected.
- UI create forms remain disabled.
- DB tests remain guarded and optional.

## Open Questions

- What provider will be selected for production auth?
- What staging process will approve the first non-local write test?
- What operational process will archive or reset dev-only fake records after broader testing?
