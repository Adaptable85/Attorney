# Database Migration Strategy

Status: Phase 1D foundation
Date: 2026-06-18

## Current State

- Prisma schema exists at `prisma/schema.prisma`.
- Prisma config exists at `prisma.config.ts`.
- No migrations have been created or applied.
- No production database connection is configured.
- `pnpm run prisma:validate` validates the schema only.

## Local / Dev Strategy

Local database setup is deferred to a future phase.

Expected future local flow:

1. Configure a local development `DATABASE_URL`.
2. Generate or apply reviewed development migrations.
3. Run dev-only seed fixtures.
4. Run repository/service tests against a controlled local database only when explicitly enabled.

Agents may validate the Prisma schema. Agents may generate dev migrations only when explicitly instructed.

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

