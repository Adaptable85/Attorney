# Database Migration Strategy

Status: Phase 3D local/dev service composition foundation
Date: 2026-06-23

## Current State

- Prisma schema exists at `prisma/schema.prisma`.
- Prisma config exists at `prisma.config.ts`.
- A local development migration has been created against `burgess_attorneys_dev`.
- No production database connection is configured.
- `pnpm run prisma:validate` validates the schema.
- `pnpm run prisma:generate` generates the local Prisma Client.
- `pnpm run prisma:migrate:dev` is available for reviewed local development migrations only.

## Local / Dev Strategy

Local database setup is available for development only.

Current local flow:

1. Configure `DATABASE_URL` with the local `burgess_attorneys_dev` database.
2. Validate the Prisma schema.
3. Generate Prisma Client.
4. Create or apply reviewed development migrations with `pnpm run prisma:migrate:dev`.
5. Run dev-only seed fixtures with `BURGESS_ALLOW_DEV_SEED=true`.
6. Reset local dev data only with `BURGESS_ALLOW_DEV_DB_RESET=true pnpm run db:reset:dev`.
7. Run repository/service database tests with `pnpm run test:db`.

Phase 3B DB integration tests are local-only. They must run only when `DATABASE_URL` points to local PostgreSQL on `localhost` or `127.0.0.1` and targets a database path containing `burgess_attorneys_dev`. Normal validation must not require `DATABASE_URL`.

Phase 3C adds local-only Prisma transaction tests using existing Client and AuditLog tables. It does not add schema, migrations or a new outbox table. AuditLog is the immediate internal outbox-equivalent until external event dispatch is designed.

Phase 3D composes local/dev Prisma repositories using the existing Client, Matter and AuditLog tables. It adds no schema changes or migrations, and DB tests remain optional/local behind `pnpm run test:db`.

Agents may validate the Prisma schema. Agents may generate dev migrations only when explicitly instructed.
Normal pre-PR checks must not require a running database.

## Staging / Production Strategy

Production migrations must not be run automatically by agents.

Production migration steps require explicit human review and approval:

- Review schema diff.
- Review generated SQL.
- Confirm backup exists.
- Confirm rollback plan.
- Confirm deployment window.
- Confirm financial/client/legal data impact.
- Confirm tests for affected critical paths.

## Rollback Expectations

Every migration plan must include:

- Forward migration summary.
- Rollback or correction strategy.
- Data recovery expectation.
- Owner of manual recovery steps.

Some migrations may not be safely reversible. Those require explicit review before execution.

## Backup Expectations

Before staging or production migrations:

- Confirm database backup has completed.
- Confirm backup can be restored.
- Record backup timestamp and environment.
- Do not run financial/client/legal data migrations without backup confirmation.

## Migration Review Checklist

- Does the migration affect client, matter, document, invoice, statement, correction, audit or permission records?
- Does it affect approved financial records?
- Does it change money fields or invoice numbering?
- Does it change privacy defaults for documents?
- Does it change agent permissions?
- Are tests updated for all affected critical paths?
- Is rollback/recovery documented?

## Critical Rules

- Production migrations must not be run automatically by agents.
- Financial/client/legal data migrations require explicit review.
- Schema changes affecting approved financial records require extra tests.
- Seed data must not contain real client data.
- Seed data must be fake, deterministic and safe for development only.
- `pnpm run db:seed` must skip by default unless `BURGESS_ALLOW_DEV_SEED=true`.
- `pnpm run db:reset:dev` must skip by default unless `BURGESS_ALLOW_DEV_DB_RESET=true` and `DATABASE_URL` points to local `burgess_attorneys_dev`.
