# Railway Implementation Checklist

Status: Phase 5O staging deploy retry successful; migration pending
Date: 2026-06-25

ADR 0011 accepts Railway for staging app hosting and Railway Postgres for the staging database. Phase 5J confirmed the Railway staging project and Railway Postgres database. Phase 5K created the empty `attorney-web` app service and configured safe/off environment gates. Phase 5L linked `DATABASE_URL` to `attorney-web` through a Railway Postgres reference and prepared the first staging deploy plan. Phase 5M attempted the first controlled staging deploy, but Railway/Railpack failed the build because no start command was detected. Phase 5N added a minimal reviewed start-command configuration. Phase 5O retried the controlled staging deploy successfully and the Attorney app is online on Railway. This checklist does not add secrets, run migrations, enable live auth, enable UI saves or enable production writes.

## Project Creation

- Approved Railway workspace confirmed: `adaptable85's Projects`.
- Railway project confirmed: `burgess-attorneys-staging`.
- Railway project ID: `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- Railway project URL: `https://railway.com/project/46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- Railway environment name: `production`.
  - Note: this is Railway's default environment name. It is not an approved Attorney production app deployment.
- Railway environment ID: `e227a158-d3c0-455e-b7d6-747f51c80fdb`.
- Next.js app service: `attorney-web`.
- Railway app service ID: `de7fc164-c220-4d5a-8c91-754423f8e994`.
- Railway app service source: none; no GitHub repo or image connected.
- Railway app service deployment status: online after Phase 5O deploy retry.
- Railway app deployment ID: `7c05f3a4-38b4-489c-a1a7-f97b3e02426f`.
- Railway app service URL/domain: not confirmed by CLI output.
- Production domain: not added.
- Production resources: not created.
- Duplicate project risk: two Railway projects reportedly appear with the name `burgess-attorneys-staging`; the active linked project is `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- Do not delete or modify any duplicate project in this phase.

## Railway Postgres Provisioning

- Railway Postgres is provisioned in the active linked Railway project/environment.
- Railway Postgres service name: `Postgres`.
- Railway Postgres service ID: `a4293b3b-f036-4ff4-ab3e-584598007a0b`.
- Railway Postgres status: `Online`.
- Railway Postgres image: `ghcr.io/railwayapp-templates/postgres-ssl:18`.
- Railway Postgres volume: `postgres-volume`.
- Railway region: `sfo`.
- Railway Postgres deployment ID: `8a6e8714-c85c-4b1b-b3c9-22439f1edce2`.
- `attorney-web` uses the Railway-provided `DATABASE_URL` through a Railway Postgres reference.
- Do not copy database URLs into Git, docs, screenshots or chat.
- Do not use real Burgess client data.
- Confirm backup/restore expectations before production planning.

## Environment Variable Checklist

Required staging values:

```text
AUTH_PROVIDER=entra
AUTH_PRODUCTION_READY=false
BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false
BURGESS_CLIENT_MATTER_WRITES_ENABLED=false
BURGESS_LOCAL_DEV_WRITES_ENABLED=false
BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false
BURGESS_PRODUCTION_WRITES_ENABLED=false
```

Confirm before any staging deploy:

- `DATABASE_URL` comes from Railway Postgres staging.
- No live Entra client secret is added.
- Production auth readiness remains false.
- All write gates remain false/off.
- No production variables are configured.
- Current status: these safe/off variables are configured on `attorney-web` and must remain false/off before any staging deploy or staging migration.
- `DATABASE_URL` linkage from Railway Postgres to `attorney-web` is configured; do not record the value in Git, docs, screenshots or chat.

## Migration Checklist

- Run `pnpm run prisma:validate`.
- Confirm `DATABASE_URL` targets Railway Postgres staging.
- Run `pnpm exec prisma migrate deploy` only after explicit staging migration approval.
- Never run `db:push`.
- Stop if any destructive reset is requested.
- Record command, timestamp, target environment and result without recording secrets.
- Current status: migration is pending and was not run in Phase 5J.
- Phase 5K status: migration remains pending and was not run.
- Phase 5L status: migration remains pending and was not run.
- Phase 5M status: migration remains pending and was not run.
- Phase 5N status: migration remains pending and was not run.
- Phase 5O status: migration remains pending and was not run.

## Staging Deploy Checklist

- Deploy only after staging resources and env vars are approved.
- `attorney-web` exists as an empty service.
- `DATABASE_URL` linkage is configured through Railway Postgres reference; do not print the value.
- Build must pass locally before deploy.
- Railway build/install commands must match the repo:
  - install: `pnpm install --frozen-lockfile`
  - build: `pnpm run build`
  - start: `pnpm start`
- Entra login/callback/logout routes remain disabled unless a later live-auth phase approves them.
- Create forms remain disabled.
- No production domain is attached.
- No production deploy is run.

Phase 5M deploy command attempted:

```sh
railway up --service attorney-web --message "Phase 5M first controlled Attorney staging deploy"
```

Phase 5M result:

- Build status: failed.
- Runtime status: not started.
- Failure cause: Railpack detected Node/pnpm but no start command.
- Staging URL: none.
- Required next fix: add or configure a Railway-compatible start command in a separate reviewed phase.

Phase 5N start-command fix prepared for review:

- `package.json` adds `start`: `next start -p ${PORT:-3000}`.
- `railway.json` sets Railpack as the builder and `pnpm start` as the deploy start command.
- No deploy retry was run after adding this config.
- Retry staging deploy only after the config fix is reviewed and merged.

Phase 5O controlled deploy retry result:

- Deploy command: `railway up --service attorney-web --message "Phase 5O controlled Attorney staging deploy retry after start config"`.
- Deployment ID: `7c05f3a4-38b4-489c-a1a7-f97b3e02426f`.
- Build status: successful.
- Runtime status: online.
- Start command: `pnpm start`.
- Staging URL: not confirmed by CLI output.
- Migration: not run.
- Production domain: not added.

First staging migration command for later explicit approval only after target service and database env are reconfirmed:

```sh
railway run pnpm exec prisma migrate deploy
```

Never use `db:push`, destructive migration reset, production migration, production database, live auth, UI saves or production writes to recover from a failed staging deploy.

## Rollback And Logs Checklist

- Capture Railway deployment reference before smoke testing.
- Review build logs and runtime logs for errors.
- Confirm logs do not print secrets.
- Roll back to the prior deployment if staging smoke checks fail.
- Disable or remove incorrect variables if unexpected behavior appears.
- Do not run rollback migrations without an approved recovery plan.

## Non-Secret Reporting Checklist

Record only:

- Railway project name.
- Railway app service name.
- Railway Postgres service name.
- Railway environment name.
- Staging app URL if created.
- Migration command/result.
- Deploy command/result.
- Safe/off env var names.
- Confirmation no production deploy/resources.

Never record:

- `DATABASE_URL`.
- Database passwords.
- Railway tokens.
- Microsoft client secrets.
- Private keys.
- Any other secret value.
