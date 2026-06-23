# Phase 5C: Vercel + Neon Staging Setup Plan

Status: planned
Date: 2026-06-23

## Summary

Phase 5C prepares the staging setup plan for the accepted Vercel + Neon hosting direction. It documents the exact setup sequence, environment variable template and pre-deploy checks needed before any live resource is created.

This phase is documentation only. It does not create a Vercel project, create a Neon database, deploy the app, add secrets, enable live Entra auth, enable UI saves or enable production writes.

## Scope

- Vercel staging setup plan.
- Neon staging database setup plan.
- Environment variable template for local, staging and production.
- Staging pre-deploy checklist.
- Context updates that record staging setup is still pending.

## Non-Goals

- No deployment.
- No Vercel project creation.
- No Neon production database creation.
- No production database command.
- No production migration.
- No `db:push`.
- No real secrets.
- No live Microsoft Entra login.
- No token exchange, session cookie or Microsoft network call.
- No UI save enablement.
- No production write enablement.
- No invoice, statement, WhatsApp or Lexpro workflow.

## Assumptions

- Vercel is the accepted secure app/API host.
- Neon is the accepted managed PostgreSQL provider.
- xneelo remains a DNS/domain/public website option only unless xneelo Cloud/Managed Server is explicitly required.
- Staging must use fake/test data only.
- Production auth readiness remains false until Entra tenant/admin access, MFA, allowed domains/users, role claims, callback URLs and staging validation are complete.
- Production writes remain false until a later live-write phase explicitly approves them.

## Risks

- Incorrect environment flags could accidentally make staging look production-ready.
- Staging and production database URLs could be confused if naming and access are not strict.
- Entra callback URLs must exactly match Vercel URLs before live auth can be tested.
- Backup/restore expectations must be confirmed before production writes.
- Vercel preview deployments can expose the app if access controls and auth-disabled behavior are not reviewed.

## Implementation Steps

1. Confirm the GitHub repository and branch strategy for Vercel.
2. Create a Vercel project only after explicit approval.
3. Configure staging/preview deploy behavior and access controls.
4. Create a Neon staging project/database only after explicit approval.
5. Keep production Neon database creation pending until production approval.
6. Add staging environment variables in the Vercel dashboard using placeholders first, then approved real values only in the provider secret store.
7. Keep `AUTH_PRODUCTION_READY=false`.
8. Keep `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false` until a live-auth staging phase approves route behavior.
9. Keep all write gates false unless a later staging-write phase explicitly approves fake-data writes.
10. Run Prisma validation and reviewed staging migrations only after explicit migration approval.
11. Run smoke tests against staging before any production decision.

## Validation

Before staging setup approval:

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

- Confirm Vercel project access.
- Confirm Neon staging database name and region.
- Confirm no production database URL is used in staging.
- Confirm no real Burgess client data is present.
- Confirm auth and write gates are false unless a later approved phase changes them.

## Rollback / Recovery

- Use Vercel deployment rollback for app regressions.
- Disable staging auth/write flags immediately if unexpected behavior appears.
- Use Neon backup/restore for database recovery after restore testing exists.
- Do not run rollback migrations without reviewed recovery instructions.
- Keep staging disposable until production readiness is approved.

## Acceptance Criteria

- Staging setup plan exists.
- Vercel staging checklist exists.
- Neon staging checklist exists.
- Environment variable template exists with placeholders only.
- Staging pre-deploy checklist exists.
- Context records that no Vercel/Neon resources have been created yet.
- Validation passes.
- No deployment, secrets, production database command, `db:push`, live auth, UI saves or production writes are enabled.

## Open Questions

- Who owns the Vercel team/project?
- Who owns the Neon project?
- Which Vercel region should be used for functions?
- Which Neon region best balances latency, reliability and client comfort?
- What staging URL will be approved?
- What production URL will be approved?
- Who owns Entra tenant/admin configuration?
- What backup retention and restore-test cadence will be accepted?
- Who approves future staging and production deploys?
