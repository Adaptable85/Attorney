# Phase 1E Local Database Migration, Prisma Client And Repository Spike

Status: In progress
Date: 2026-06-18

## Scope

Phase 1E proves the local-only database workflow for the existing Prisma schema.

This phase does not add product features, UI, invoice screens, statement screens, PDF generation, email, WhatsApp automation, Lexpro import, payment reconciliation, website, marketing or outreach.

## Local Database

- Local database: `burgess_attorneys_dev`.
- Local connection: `postgresql://wesleyduplessis@localhost:5432/burgess_attorneys_dev`.
- Production database connections are out of scope.
- Production migrations must not be run automatically by agents.

## Work Plan

1. Confirm local PostgreSQL is available.
2. Add safe local scripts for Prisma client generation, local dev migrations, dev seed, guarded dev reset and DB-only tests.
3. Generate Prisma Client locally.
4. Create a dev migration named `init_burgess_foundation`.
5. Implement a minimal Prisma users/roles repository adapter.
6. Keep seed data fake, deterministic and guarded by `BURGESS_ALLOW_DEV_SEED=true`.
7. Keep database integration tests behind `pnpm run test:db`.
8. Update architecture and context docs.

## Acceptance Criteria

- Normal lint, typecheck, test, coverage and build commands do not require a running database.
- `pnpm run prisma:validate` passes.
- `pnpm run prisma:generate` passes.
- Local migration is created only against the local dev database.
- Default `pnpm run db:seed` skips without writes.
- Default `pnpm run db:reset:dev` skips without resetting anything.
- Explicit dev seed writes fake users and roles only.
- Repository adapter does not expose hard delete behavior.
- DB integration test can create/read fake user records against the local dev database.
