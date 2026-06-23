# Phase 3D Local/Dev Client-Matter Service Composition

Status: Implemented for review
Date: 2026-06-23

## Summary

Phase 3D wires the local/dev Prisma transaction boundary, client/matter repositories and AuditLog repository into a backend service composition layer. This proves that audited client/matter create operations can be composed locally without enabling UI saves, server actions, API mutation routes or production database operations.

## Scope

- Add Prisma AuditLog repository adapter and audit writer bridge.
- Add local/dev client-matter service composition factory.
- Wire client/matter repositories, transaction boundary and audit writer factories through the composition.
- Add normal unit tests for composition shape, fail-closed behavior and safe errors.
- Add DB-only tests for composed fake client/matter create and blocked roles.
- Keep create forms disabled.
- Update guardrails so UI/app routes cannot import local/dev composition or mutation dependencies.
- Update docs/context.

## Non-Goals

- No live UI save.
- No enabled create forms.
- No server action write.
- No API mutation route.
- No production database operation.
- No production migration.
- No `db:push`.
- No invoice, statement, PDF, email, WhatsApp, Lexpro, payment reconciliation, website, marketing or outreach behavior.
- No hard-delete methods.

## Assumptions

- Phase 3C transaction boundary remains the write-safety gate.
- Composition is explicitly local/dev only and disabled in production.
- Normal validation must remain database-free.
- DB integration tests may be skipped when `DATABASE_URL` is unset.
- If `DATABASE_URL` is set, DB tests must use only local `burgess_attorneys_dev`.

## Risks

- The backend composition path is ready for local/dev testing only.
- Production auth still blocks live persistence.
- UI save remains intentionally disabled until production auth and release approval.
- DB tests create fake `DEMO-*` records and do not truncate tables.

## Implementation Steps

1. Add Prisma AuditLog repository adapter.
2. Add audit writer bridge from repository to `AuditEventWriter`.
3. Add local/dev service composition factory.
4. Wire transaction-scoped client/matter repositories and audit writer factories.
5. Add normal unit tests for factory behavior and safe errors.
6. Add guarded DB-only service composition tests.
7. Keep forms disabled and update copy.
8. Extend architecture guardrails.
9. Update docs/context.

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

Run DB validation only when `DATABASE_URL` is set and the guard accepts it as local/dev.

## Rollback / Recovery

- Revert the Phase 3D commit to remove the composition factory, audit adapter and tests.
- No schema changes or migrations are part of this phase.
- No production data is touched.
- If local DB tests create unwanted fake rows, remove only rows with `DEMO-CLIENT-3D-` or `DEMO-MATTER-3D-` prefixes after confirming the database is local development.

## Acceptance Criteria

- Local/dev composition factory refuses production and missing Prisma dependencies.
- Composition wires client, matter, transaction and audit dependencies.
- Owner/support fake client create works through composed dependencies in DB tests.
- Agent/reviewer create attempts fail without writing fake records.
- Owner fake matter create works through composed dependencies in DB tests.
- Forced repository failure rolls back fake client creation.
- Create forms remain disabled and UI/app routes do not import local/dev composition.

## Open Questions

- Which production auth provider will supply live service principals?
- Which future phase will expose a reviewed server action or route using this composition pattern?
- Should local DB cleanup helpers become stricter once fixture isolation is formalized?
