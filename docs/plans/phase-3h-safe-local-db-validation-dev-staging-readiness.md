# Phase 3H Safe Local DB Validation And Dev/Staging Readiness

Status: Implemented for review
Date: 2026-06-23

## Summary

Phase 3H records the safe local DB validation path and dev/staging readiness checklist for the Burgess Attorneys platform. The current execution environment does not have local PostgreSQL CLI/server availability, so DB-only tests remain ready but were not run here.

## Scope

- Probe local PostgreSQL availability safely.
- Verify local-only `DATABASE_URL` handling.
- Document DB validation status and blocker.
- Add dev/staging readiness checklist.
- Add safe local DB helper scripts.
- Keep normal validation database-free.
- Keep UI saves and production writes disabled.

## Non-Goals

- No production database commands.
- No `db:push`.
- No production migrations.
- No deploy.
- No real client data.
- No UI save enablement.
- No production auth provider setup.
- No invoice, statement, PDF, email, WhatsApp, Lexpro, payment reconciliation, website, marketing or outreach behavior.

## Assumptions

- DB-only tests should run only against local PostgreSQL.
- The accepted local database name is `burgess_attorneys_dev`.
- The existing DB guard is the enforcement point for DB test safety.
- PostgreSQL is not available in this execution environment because `psql`, `pg_isready` and `createdb` are unavailable.

## Risks

- DB-only tests still need to be run on a machine with local PostgreSQL available.
- Local fake records created by DB tests are archived, not hard-deleted.
- Future staging writes require separate release approval and production-auth review.

## Implementation Steps

1. Confirm repository and baseline commit.
2. Read DB guard, Prisma config, migration strategy and mutation DB tests.
3. Probe `psql`, `pg_isready`, `createdb` and `DATABASE_URL`.
4. Validate Prisma schema using the local-only candidate URL.
5. Attempt local migration status only against the local-only candidate URL.
6. Skip DB tests when local PostgreSQL is unavailable.
7. Add readiness checklist documentation.
8. Add safe local DB helper scripts.
9. Update docs/context.
10. Run normal validation.

## Validation

Normal validation:

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

Local DB validation when PostgreSQL is available:

```sh
DATABASE_URL="postgresql://adaptable@localhost:5432/burgess_attorneys_dev" pnpm exec prisma migrate status
DATABASE_URL="postgresql://adaptable@localhost:5432/burgess_attorneys_dev" pnpm run test:db
```

Use `pnpm run db:migrate:local` only for reviewed local migrations. Never use `db:push`.

## Rollback / Recovery

- Revert the Phase 3H commit to remove checklist/script/doc updates.
- No schema changes, migrations, routes, UI save wiring or production writes are included.
- Disable any local DB env vars if a local validation attempt points at the wrong database.

## Acceptance Criteria

- Local DB safety status is documented.
- Dev/staging readiness checklist exists.
- Normal validation remains database-free.
- DB guard refuses non-local URLs.
- Local helper scripts use only `localhost` and `burgess_attorneys_dev`.
- UI saves remain disabled.
- Production writes remain blocked.

## Open Questions

- Which workstation or CI runner will own the first successful `pnpm run test:db` run?
- Will staging use a separate reviewed database name and guard?
- Who records the release approval before any staging write test?
