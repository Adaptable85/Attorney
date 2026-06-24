# Phase 5G: Vercel + Supabase Database Direction

Status: historical / superseded by ADR 0011
Date: 2026-06-23

Phase 5I note: ADR 0011 supersedes this active staging direction with Railway + Railway Postgres. This plan remains as decision history unless Vercel + Supabase is later re-approved.

## Summary

Phase 5G records Supabase Postgres as the approved managed PostgreSQL replacement for Neon while keeping Vercel as the secure Next.js app/API host.

This phase is documentation only. It does not create Vercel resources, create Supabase resources, deploy the app, add secrets, run database commands, enable live Entra auth, enable UI saves or enable production writes.

## Scope

- ADR 0010 for the Vercel + Supabase Postgres direction.
- Supabase staging setup checklist.
- Vercel/Supabase implementation checklist.
- Updates to active staging, environment and context documentation.
- Historical notes on superseded Neon planning artifacts.

## Non-Goals

- No deployment.
- No Vercel project creation.
- No Supabase project creation.
- No production database command.
- No production migration.
- No `db:push`.
- No real secrets.
- No Supabase Auth.
- No Supabase Storage.
- No live Microsoft Entra login.
- No UI save enablement.
- No production write enablement.
- No invoice, statement, WhatsApp or Lexpro workflow.

## Assumptions

- Vercel remains the accepted secure app/API host.
- Supabase Postgres is the accepted managed PostgreSQL provider.
- Microsoft Entra ID / Microsoft 365 identity remains the accepted production auth provider direction.
- Supabase is used as managed PostgreSQL only.
- xneelo remains a DNS/domain/public website option only unless xneelo Cloud/Managed Server is explicitly required.
- Staging must use fake/test data only.
- Production auth readiness and production writes remain false until later explicit approvals.

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

## Acceptance Criteria

- ADR 0010 exists and supersedes the Neon database-provider part of ADR 0009.
- Active staging and implementation checklists point to Supabase Postgres.
- Historical Neon docs are retained with clear superseded notes.
- Context and agent instruction files recorded the then-active Vercel + Supabase direction; ADR 0011 later superseded it for staging.
- No provider resource, deployment, secret, database command, `db:push`, live auth, UI save or production write is created/enabled.

## Next Decision

Historical next step was Vercel + Supabase staging resource creation. ADR 0011 now supersedes this with Railway staging resource planning.
