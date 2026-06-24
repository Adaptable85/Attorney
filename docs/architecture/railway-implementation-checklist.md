# Railway Implementation Checklist

Status: Phase 5I planning
Date: 2026-06-24

ADR 0011 accepts Railway for staging app hosting and Railway Postgres for the staging database. This checklist is planning only. It does not create resources, deploy, add secrets, run migrations, enable live auth, enable UI saves or enable production writes.

## Project Creation

- Confirm approved Railway workspace.
- Create Railway project `burgess-attorneys-staging` only after explicit approval.
- Add a Next.js app service connected to `Adaptable85/Attorney`.
- Keep the environment clearly labelled staging.
- Do not add a production domain.
- Do not create production resources.

## Railway Postgres Provisioning

- Provision Railway Postgres only in the staging project/environment.
- Use the Railway-provided `DATABASE_URL` through Railway variables.
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

## Migration Checklist

- Run `pnpm run prisma:validate`.
- Confirm `DATABASE_URL` targets Railway Postgres staging.
- Run `pnpm exec prisma migrate deploy` only after explicit staging migration approval.
- Never run `db:push`.
- Stop if any destructive reset is requested.
- Record command, timestamp, target environment and result without recording secrets.

## Staging Deploy Checklist

- Deploy only after staging resources and env vars are approved.
- Build must pass locally before deploy.
- Railway build/install commands must match the repo:
  - install: `pnpm install --frozen-lockfile`
  - build: `pnpm run build`
- Entra login/callback/logout routes remain disabled unless a later live-auth phase approves them.
- Create forms remain disabled.
- No production domain is attached.
- No production deploy is run.

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
