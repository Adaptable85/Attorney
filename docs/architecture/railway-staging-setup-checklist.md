# Railway Staging Setup Checklist

Status: Phase 5N start command config prepared for review
Date: 2026-06-25

This checklist records the current Railway staging setup state, the first staging deploy attempt and the reviewed start-command fix prepared in Phase 5N. It does not add secrets, run database commands, retry deployment, enable live auth, enable UI saves or enable production writes.

## Target Resources

- Railway workspace/account: `adaptable85's Projects`.
- Railway project name: `burgess-attorneys-staging`.
- Railway project ID: `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- Railway project URL: `https://railway.com/project/46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- Railway environment name: `production`.
  - Note: this is Railway's default environment name. It is not an approved Attorney production app deployment.
- Railway environment ID: `e227a158-d3c0-455e-b7d6-747f51c80fdb`.
- Railway service: Next.js app service created as an empty service.
- Railway app service name: `attorney-web`.
- Railway app service ID: `de7fc164-c220-4d5a-8c91-754423f8e994`.
- Railway app service source: none; no GitHub repo or image connected.
- Railway app deployment status: attempted and failed before runtime.
- Railway app deployment ID: `39710650-fe18-4bf9-a6ea-a068a6c0d57e`.
- Railway app URL/domain: none.
- Railway database: Railway Postgres created.
- Railway Postgres service name: `Postgres`.
- Railway Postgres service ID: `a4293b3b-f036-4ff4-ab3e-584598007a0b`.
- Railway Postgres status: `Online`.
- Railway Postgres image: `ghcr.io/railwayapp-templates/postgres-ssl:18`.
- Railway Postgres volume: `postgres-volume`.
- Railway region: `sfo`.
- Railway Postgres deployment ID: `8a6e8714-c85c-4b1b-b3c9-22439f1edce2`.
- Database purpose: staging only.
- `DATABASE_URL`: linked to `attorney-web` through Railway Postgres reference; value must not be recorded.
- Production domain: not added.

## Current Gaps

- Railway app service exists but is empty.
- Attorney app is not running; first deploy attempt failed during Railpack build because no start command was detected.
- Phase 5N prepared a minimal Railway start-command config for review.
- Staging migration is pending.
- Safe/off environment gates are configured on `attorney-web`.
- `AUTH_PRODUCTION_READY=false` is configured on `attorney-web`.
- `DATABASE_URL` linkage from Railway Postgres to `attorney-web` is configured; no value is recorded in Git or docs.
- Two Railway projects reportedly share the name `burgess-attorneys-staging`; the active linked project is `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- Do not delete or modify any duplicate project in this phase.

## Required Environment Variables

These values are configured on `attorney-web` and must remain unchanged until a later approved live-auth/write phase:

```text
AUTH_PROVIDER=entra
AUTH_PRODUCTION_READY=false
BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false
BURGESS_CLIENT_MATTER_WRITES_ENABLED=false
BURGESS_LOCAL_DEV_WRITES_ENABLED=false
BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false
BURGESS_PRODUCTION_WRITES_ENABLED=false
```

Do not add live Microsoft Entra tenant, client secret or production auth values in the staging resource creation phase.

## Migration Policy

- Validate Prisma schema before staging migration:

  ```sh
  pnpm run prisma:validate
  ```

- Approved staging migration command:

  ```sh
  pnpm exec prisma migrate deploy
  ```

- Never run `db:push`.
- Do not run destructive reset commands.
- Do not run production migrations.
- Do not use a production database URL.
- Do not load real Burgess client data.

## First Staging Deploy Plan

Phase 5M executed the first controlled deploy attempt. It failed before runtime because Railway/Railpack did not detect a start command. Do not retry until a reviewed start-command/config fix is merged.

Preconditions:

- Active Railway project ID is `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- Target service is `attorney-web`.
- `DATABASE_URL` is linked from Railway Postgres and the value is not printed.
- Safe/off env vars are configured.
- `AUTH_PRODUCTION_READY=false`.
- No production domain is attached.
- No real Burgess client data is loaded.
- Create forms remain disabled.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.

Deploy command used in Phase 5M:

```sh
railway up --service attorney-web --message "Phase 5M first controlled Attorney staging deploy"
```

Migration command for later approval only after deploy target and database env are reconfirmed:

```sh
railway run pnpm exec prisma migrate deploy
```

Do not run `db:push`, destructive resets, production migrations, production database commands, live auth, UI saves or production writes.

Rollback/check steps:

- Capture the Railway deployment reference.
- Check Railway deployment logs and runtime logs.
- Check the health page if available.
- Stop on build or runtime failure.
- Do not retry by loosening gates.

Phase 5M result:

- Deployment ID: `39710650-fe18-4bf9-a6ea-a068a6c0d57e`.
- Build status: failed.
- Runtime status: not started.
- Staging URL: none.
- Migration: not run.
- Required next fix: add or configure a Railway-compatible start command in a separate reviewed phase.

## Explicitly Forbidden

- No production deployment.
- No production Railway project/database.
- No production domain.
- No `db:push`.
- No production migration.
- No live Microsoft Entra auth.
- No UI saves.
- No production writes.
- No invoice, statement, WhatsApp, email or Lexpro workflows.

## Pre-Deploy Checks

- Repository is clean and on reviewed code.
- Staging app service creation has explicit approval.
- Railway project/database names are clearly staging-only.
- Active Railway project ID is `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- `DATABASE_URL` points only to Railway Postgres staging.
- Safe/off env vars are configured.
- `attorney-web` has failed deployment ID `39710650-fe18-4bf9-a6ea-a068a6c0d57e`; no successful running deployment exists yet.
- `attorney-web` has no production domain.
- Build command is `pnpm run build`.
- Install command is `pnpm install --frozen-lockfile`.
- Start command prepared for review is `pnpm start`.
- Create forms remain disabled.
- Entra routes remain disabled until a later live-auth phase.
- No secrets are committed to Git.

## Phase 5N Start Command Fix

Railway build logs for deployment `39710650-fe18-4bf9-a6ea-a068a6c0d57e` confirmed Railpack detected Node and pnpm but stopped with `No start command detected`.

The prepared fix is:

- `package.json`: `start` script set to `next start -p ${PORT:-3000}`.
- `railway.json`: Railpack builder retained and deploy start command set to `pnpm start`.

Do not retry deploy until this change is reviewed and merged. Do not run migrations as part of the start-command fix.
