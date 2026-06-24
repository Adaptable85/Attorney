# Railway Staging Setup Checklist

Status: Phase 5I planning
Date: 2026-06-24

This checklist prepares Railway staging setup only. It does not create Railway resources, deploy the app, add secrets, run database commands, enable live auth, enable UI saves or enable production writes.

## Target Resources

- Railway project name: `burgess-attorneys-staging`.
- Railway service: Next.js app service.
- Railway database: Railway Postgres.
- Database purpose: staging only.
- `DATABASE_URL`: supplied by Railway Postgres through Railway variables.

## Required Environment Variables

Set these in the Railway staging environment only after resource creation is explicitly approved:

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
- Staging resource creation has explicit approval.
- Railway project/service/database names are clearly staging-only.
- `DATABASE_URL` points only to Railway Postgres staging.
- Safe/off env vars are configured.
- Build command is `pnpm run build`.
- Install command is `pnpm install --frozen-lockfile`.
- Create forms remain disabled.
- Entra routes remain disabled until a later live-auth phase.
- No secrets are committed to Git.
