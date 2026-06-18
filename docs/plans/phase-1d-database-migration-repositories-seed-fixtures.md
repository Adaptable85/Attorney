# Phase 1D: Database Migration Strategy, Repositories And Seed Fixtures

Status: Accepted for implementation
Phase: 1D
Date: 2026-06-18

## Summary

Create the persistence infrastructure foundation for future database-backed work.

This phase documents the migration strategy, adds repository interface boundaries, creates a Prisma client boundary, adds deterministic fake test fixtures and provides a guarded dev-only seed skeleton.

## Scope

- Document migration and rollback expectations.
- Add an ADR for reviewed Prisma migration control.
- Add repository interfaces only; no full CRUD implementation.
- Add a Prisma client boundary that does not require a database in unit tests.
- Add deterministic fake fixtures for users, clients, matters and financial records.
- Add a dev-only seed skeleton.
- Add tests for repository safety, fixtures, seed guardrails and migration documentation.

## Non-Goals

- No UI.
- No dashboard pages.
- No client/matter pages.
- No invoice/statement screens.
- No PDF generation.
- No email/WhatsApp sending.
- No Lexpro import/sync.
- No payment reconciliation.
- No production migration execution.
- No real database seeding.

## Assumptions

- No production database connection is available yet.
- Prisma schema is the schema definition source.
- Migrations must be reviewed before being applied.
- Agents may validate schema and prepare dev-only migration artifacts only when explicitly instructed.
- Seed data must be fake and must never contain real Burgess client information.

## Risks

- Repository interfaces may need adjustment once actual persistence implementation begins.
- Prisma 7 client generation/build-script behavior may require explicit approval in a future local DB phase.
- Seed skeleton should not be mistaken for a production bootstrap process.
- Migration strategy must be revisited before staging/production deployment.

## Implementation Steps

1. Confirm clean Git status.
2. Add migration strategy documentation.
3. Add migration-control ADR.
4. Add repository interfaces.
5. Add Prisma client boundary.
6. Add fake deterministic fixtures.
7. Add dev-only seed skeleton and package script.
8. Add tests and guardrails.
9. Update affected docs/context.
10. Run deterministic validation.
11. Commit Phase 1D.

## Validation

Run:

```sh
git status
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

## Rollback / Recovery

- Before commit: revert Phase 1D files with Git.
- After commit: use a normal revert commit.
- Do not remove accepted prior foundations.
- Do not apply production migrations as part of rollback.

## Acceptance Criteria

- Migration strategy document exists and prohibits automatic production migrations by agents.
- ADR records reviewed Prisma migration control.
- Repository interfaces expose no protected hard-delete methods.
- Prisma boundary can be imported without requiring `DATABASE_URL`.
- Fixtures are fake, deterministic and include all four day-one roles.
- Seed skeleton is dev-only and guarded.
- Full validation passes.

## Open Questions

- Which local database workflow should Phase 1E use?
- Should migrations be generated before repository implementations or together with them?
- What staging/production backup tooling will be used?
- What seed data, if any, should exist beyond roles and permissions?

