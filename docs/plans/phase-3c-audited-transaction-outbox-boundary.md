# Phase 3C Audited Transaction / Outbox Boundary

Status: Implemented for review
Date: 2026-06-23

## Summary

Phase 3C adds the service-level audited transaction boundary required before live persistence can be exposed. Client and matter create preparation can now run audit recording and repository mutation inside an injected transaction boundary, while UI forms remain disabled and no production database writes are enabled.

## Scope

- Add transaction boundary types and a default immediate boundary for normal tests.
- Add a fake transaction boundary for deterministic unit tests.
- Add a Prisma transaction boundary adapter for local/dev DB use.
- Update audited mutation execution so permission, audit metadata, audit recording and repository mutation are coupled through the boundary.
- Thread optional transaction boundaries through client and matter create services.
- Add unit tests for permission denial, missing context, missing permission decision, missing audit metadata, audit failure, repository failure and transaction failure.
- Add guarded DB-only tests for Prisma transaction commit and rollback behavior.
- Keep create forms disabled and away from Prisma/repository/transaction imports.
- Update docs/context and record the ADR.

## Non-Goals

- No live UI save.
- No server action or API mutation route.
- No production database write.
- No production migration.
- No `db:push`.
- No new outbox table.
- No invoice, statement, payment, Lexpro, document upload, email, WhatsApp, website, marketing or outreach behavior.
- No hard-delete methods.

## Assumptions

- AuditLog is the immediate durable audit boundary for internal writes.
- A separate outbox table is not justified until an external event dispatcher exists.
- Normal validation must remain database-free.
- DB integration tests may be skipped when `DATABASE_URL` is unset.
- If `DATABASE_URL` is set, DB tests must use only local `burgess_attorneys_dev`.

## Risks

- The default transaction boundary is immediate and exists for normal unit tests only.
- Real transaction atomicity depends on injecting a Prisma transaction boundary when live persistence is eventually wired.
- Future external notifications or integrations will require a separate outbox table and dispatcher design.
- UI save remains blocked until production auth, release approval and transaction-wired repositories are reviewed together.

## Implementation Steps

1. Add `TransactionBoundary` and fake/default implementations.
2. Add Prisma transaction boundary adapter.
3. Update audited mutation execution to require context, permission decision and audit metadata before transaction work.
4. Record audit and run repository mutation inside the transaction boundary.
5. Preserve safe typed errors for audit, repository and transaction failures.
6. Thread optional transaction boundaries through client/matter create services.
7. Add normal unit tests and guarded DB tests.
8. Keep create forms disabled and update guardrails.
9. Update docs/context and add ADR 0006.

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

- Revert the Phase 3C commit to remove the transaction boundary, ADR and tests.
- No schema changes or migrations are part of this phase.
- No production data is touched.
- If local DB tests create unwanted fake rows, remove only rows with `DEMO-CLIENT-3C-` prefixes after confirming the database is local development.

## Acceptance Criteria

- Audited mutation execution refuses missing actor context, missing permission decision and missing audit metadata.
- Permission denial, validation failure and audit failure prevent repository writes.
- Repository failures and transaction failures return safe typed errors.
- Successful client and matter create preparation can run through an injected transaction boundary.
- Prisma transaction DB tests are guarded and local-only.
- Create forms remain disabled and do not import Prisma, repository adapters or transaction boundaries.
- Docs state why live persistence is still blocked.

## Open Questions

- Which production auth provider will supply the actor identity for live audited writes?
- Should future external integrations use a single outbox table or integration-specific dispatch tables?
- Which route/server-action phase should first wire Prisma transaction scope into real repositories?
