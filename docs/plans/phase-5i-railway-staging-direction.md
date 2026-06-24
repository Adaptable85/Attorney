# Phase 5I: Railway Staging Direction

Status: planned
Date: 2026-06-24

## Summary

Phase 5I records the switch from Vercel + Supabase to Railway + Railway Postgres for the Burgess Attorneys staging hosting/database path.

This phase is documentation and planning only. It does not create Railway resources, deploy, add secrets, run database commands, enable live auth, enable UI saves or enable production writes.

## What Changed

- Previous active direction: Vercel for app hosting and Supabase Postgres for managed PostgreSQL.
- New active staging direction: Railway for the Next.js app and Railway Postgres for the staging database.
- Reason: the Vercel/GitHub/Supabase operator flow was not working well for the user, while Railway better matches existing project operations.
- Vercel + Supabase docs remain as historical/superseded decision history unless later re-approved.

## What Remains Pending

- Railway workspace/project approval.
- Railway project creation.
- Railway app service creation.
- Railway Postgres provisioning.
- Staging environment variable setup.
- Staging migration approval and execution.
- Staging preview deployment approval.
- Staging smoke QA.
- Production hosting/database approval.

## Safety Boundaries

- No Railway resources created.
- No deploy.
- No production database.
- No production domain.
- No `db:push`.
- No production migration.
- No secrets committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No invoice, statement, WhatsApp, email or Lexpro workflow starts.

## Validation

Before review:

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

## Recommended Next Phase

Create Railway staging resources through operator-guided Railway dashboard steps or approved Railway CLI tooling, then document only non-secret resource details in a review branch.
