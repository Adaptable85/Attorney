# Phase 5D: Staging Resource Creation Runbook

Status: planned
Date: 2026-06-23

Phase 5G note: ADR 0010 supersedes this plan's Neon database-provider direction with Supabase Postgres. This document is retained as historical context for Phase 5D. Use `docs/architecture/staging-resource-creation-runbook.md`, `docs/architecture/supabase-staging-setup-checklist.md` and `docs/architecture/vercel-supabase-implementation-checklist.md` for active staging planning.

## Summary

Phase 5D prepares the operational runbook and approval checklist for creating staging resources on Vercel and Neon. It turns the Phase 5C setup plan into an approval-controlled sequence that can be followed later.

This phase is documentation only. It does not create Vercel resources, create Neon resources, deploy, add secrets, run database commands, enable live auth, enable UI saves or enable production writes.

## Scope

- Staging resource creation runbook.
- Staging approval checklist.
- Updates to existing Vercel/Neon staging setup docs and context.
- Explicit safety boundaries for future staging resource creation.

## Non-Goals

- No Vercel project creation.
- No Neon project, branch or database creation.
- No deployment.
- No production database command.
- No production migration.
- No `db:push`.
- No real secrets.
- No live Microsoft Entra login.
- No UI save enablement.
- No production write enablement.
- No invoice, statement, WhatsApp or Lexpro workflow.

## Assumptions

- Vercel and Neon remain the accepted hosting/database direction.
- Phase 5C setup templates are accepted as planning artifacts.
- Resource creation requires explicit approval after this runbook is reviewed.
- Staging must use fake/test data only.
- Production domains, production database and production deploy remain out of scope.
- Entra tenant/admin ownership may still be pending.

## Risks

- A staging resource could be mistaken for production if naming and labels are unclear.
- A real database URL could be copied into Git or local shell history if handling is sloppy.
- Migration commands could target the wrong database if `DATABASE_URL` is not verified.
- Vercel preview settings could create public exposure before auth readiness is reviewed.
- Smoke testing could accidentally use real client data if data rules are not enforced.

## Implementation Steps

1. Review and approve `docs/architecture/staging-resource-approval-checklist.md`.
2. Confirm Vercel team/account owner and project access.
3. Confirm Neon account/project owner and region.
4. Confirm staging URL and branch/deployment strategy.
5. Confirm environment variable owner and secret-handling process.
6. Confirm migration runner and backup/restore owner.
7. Confirm no real client data will be used in staging.
8. Create Vercel and Neon staging resources only after explicit approval.
9. Configure environment variables only in approved provider secret stores.
10. Run reviewed staging migration and smoke tests only after migration/deploy approval.
11. Record actions taken, owners, URLs and rollback references.

## Validation

Before resource creation approval:

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

If local PostgreSQL is available:

```sh
pnpm run test:db:local
```

Before a future staging deploy:

- Confirm the staging branch/deployment target.
- Confirm Vercel environment variables are placeholders or approved staging values only.
- Confirm Neon connection string belongs to staging only.
- Confirm `AUTH_PRODUCTION_READY=false`.
- Confirm write gates remain false/off.
- Confirm no real client data is present.

## Rollback / Recovery

- Remove or rotate staging environment variables if incorrectly configured.
- Disconnect the staging database from Vercel if the wrong database is attached.
- Delete the Neon staging branch/database if needed and approved.
- Roll back Vercel deployment if staging deploy later fails smoke tests.
- Keep an audit note of every resource action, credential rotation and cleanup.
- Do not attempt production rollback or migration rollback from this runbook.

## Acceptance Criteria

- Phase 5D plan exists.
- Staging resource creation runbook exists.
- Staging resource approval checklist exists.
- Existing Vercel/Neon setup docs point to the runbook.
- Context records that resource creation still requires explicit approval.
- Validation passes.
- No Vercel resource, Neon resource, deployment, secret, production database command, `db:push`, live auth, UI save or production write is created/enabled.

## Open Questions

- Who approves actual staging resource creation?
- Which Vercel team/account will own the project?
- Which Neon account/project will own staging?
- Which region is approved for Vercel functions and Neon?
- What staging URL will be used?
- Who owns Entra tenant/admin setup?
- Who owns migration execution?
- Who owns backup/restore checks?
- Who records the staging resource audit trail?
