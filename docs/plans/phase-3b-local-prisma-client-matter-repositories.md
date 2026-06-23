# Phase 3B Local Prisma Client/Matter Repositories

Status: Implemented for review
Date: 2026-06-23

## Summary

Phase 3B adds local-only Prisma repository adapters for clients and matters. The work proves that the audited service-layer persistence boundary can write through the existing Prisma schema in local development, without enabling live UI saves, API mutations or production database operations.

## Scope

- Add Prisma-backed client repository adapter.
- Add Prisma-backed matter repository adapter.
- Add unit tests for adapter mapping and protected repository method shape.
- Add DB integration tests that run only through `pnpm run test:db`.
- Guard DB integration tests so they refuse non-local/non-dev `DATABASE_URL` values.
- Keep normal validation database-free.
- Keep client and matter create forms disabled.
- Update architecture/context documentation for the local-only persistence boundary.

## Non-Goals

- No live UI save.
- No server actions or API mutation routes.
- No production database access.
- No production migrations.
- No `db:push`.
- No invoice, statement, payment, Lexpro, document upload, email, WhatsApp, website, marketing or outreach behavior.
- No hard-delete repository methods.

## Assumptions

- The existing Prisma schema remains the source for local client and matter persistence shape.
- Client and matter services remain the only approved future callers for create behavior.
- Normal validation must pass without `DATABASE_URL`.
- DB integration tests may be skipped when `DATABASE_URL` is unset.
- If `DATABASE_URL` is set, it must point to a local PostgreSQL database named like `burgess_attorneys_dev`.

## Risks

- The adapters are intentionally small and do not yet provide transaction atomicity with audit writes.
- Live writes still need a production auth decision and transaction or outbox design before UI enablement.
- DB tests create fake rows and avoid broad cleanup to prevent unsafe table truncation in accidental environments.

## Implementation Steps

1. Add client and matter Prisma adapters under `src/repositories/prisma/`.
2. Add adapter unit tests using mocked Prisma-shaped clients.
3. Add local/dev DB guard helpers for DB-only tests.
4. Add client and matter DB integration tests for fake create/read/list/update behavior.
5. Apply the same DB guard to existing Prisma DB tests.
6. Strengthen service tests so denied, invalid and audit-failed writes do not call repositories.
7. Strengthen guardrails for direct UI Prisma use, repository hard-delete methods, DB test guards and normal-test database independence.
8. Keep create form controls disabled and update their explanatory text.
9. Update architecture and context docs.

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

- Revert the Phase 3B commit to remove local Prisma adapters and DB tests.
- No schema changes or migrations are part of this phase.
- No production data is touched.
- If a local DB test creates unwanted fake rows, remove only rows with the `DEMO-CLIENT-3B-` or `DEMO-MATTER-3B-` prefixes after confirming the database is local development.

## Acceptance Criteria

- Client Prisma adapter can create, read and list fake clients locally.
- Matter Prisma adapter can create, read, list and update fake matters locally.
- Repository adapters expose no hard-delete methods.
- Normal test, coverage, lint, typecheck and build commands do not require a database.
- DB tests are isolated behind `pnpm run test:db` and guarded against unsafe database URLs.
- Client/matter create forms remain disabled and do not call Prisma or repository adapters directly.
- Docs clearly state that live writes still require production auth and transaction/outbox design.

## Open Questions

- Should audited live writes use a Prisma transaction, outbox pattern, or both?
- Which production auth provider will supply the actor identity for audited writes?
- What cleanup strategy should local DB tests use once fixture isolation requirements are formalized?
