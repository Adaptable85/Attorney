# Vercel And Supabase Implementation Checklist

Status: Historical / superseded by ADR 0011
Date: 2026-06-23

ADR 0010 accepted Vercel for the secure Next.js app/API and Supabase Postgres for managed PostgreSQL. ADR 0011 supersedes the active staging direction with Railway + Railway Postgres. This checklist is retained as historical context only. Use `docs/architecture/railway-implementation-checklist.md` for active staging planning.

## Current Direction

- App/API hosting: Vercel.
- Managed PostgreSQL: Supabase Postgres.
- Auth provider: Microsoft Entra ID / Microsoft 365 identity.
- Supabase Auth: not adopted.
- Supabase Storage: not adopted.
- xneelo: DNS/domain/public website option only unless explicitly changed.

## Staging Setup

- Create a Supabase staging project only after explicit approval.
- Recommended staging project name: `burgess-attorneys-staging`.
- Store staging `DATABASE_URL` only in Vercel preview/staging environment variables.
- Keep `AUTH_PRODUCTION_READY=false`.
- Keep `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false`.
- Keep write gates false/off.
- Use fake/test data only.

## Production Setup Later

- Create a Supabase production project only after explicit production database approval.
- Recommended production project name: `burgess-attorneys-production`.
- Do not use production connection strings in local or preview environments.
- Confirm backup/restore process before production writes.
- Run production migrations only after staging success, backup confirmation and explicit approval.

## Environment Variables

Configure placeholders first, then real values only in approved provider secret stores:

- `DATABASE_URL`
- `AUTH_PROVIDER`
- `AUTH_ENTRA_TENANT_ID`
- `AUTH_ENTRA_CLIENT_ID`
- `AUTH_ENTRA_CLIENT_SECRET`
- `AUTH_ENTRA_REDIRECT_URI`
- `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS`
- `AUTH_ENTRA_ROLE_CLAIM`
- `AUTH_PRODUCTION_READY`
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED`
- `BURGESS_AUDITED_PERSISTENCE_ENABLED`
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED`
- `BURGESS_PRODUCTION_AUTH_PROVIDER`
- `BURGESS_PRODUCTION_AUTH_ENABLED`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED`
- `BURGESS_PRODUCTION_WRITES_ENABLED`

Production defaults must remain fail-closed until approved:

- `AUTH_PRODUCTION_READY=false`
- `BURGESS_PRODUCTION_AUTH_ENABLED=false`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED=false`
- `BURGESS_PRODUCTION_WRITES_ENABLED=false`

## Migration Policy

- Run `pnpm run prisma:validate` before migrations.
- Review Prisma migration SQL before staging.
- Apply migration to staging first.
- Confirm staging smoke tests pass.
- Take/confirm production backup before production migration.
- Run production migration only with explicit approval.
- Never use `db:push`.

## Smoke Tests

- App root loads.
- `/admin` shell loads.
- `/admin/dashboard`, `/admin/clients` and `/admin/matters` load.
- Entra route placeholders remain disabled until live-auth phase.
- Client/matter create forms remain disabled.
- Production write gates remain off.
- Health route responds.
- No real client data appears in staging.

## Production Deploy Approval Checklist

- App host accepted: Vercel.
- Database provider accepted: Supabase Postgres.
- Staging URL approved.
- Production URL approved.
- DNS/domain approach approved.
- Entra tenant/admin access confirmed.
- Backup retention approved.
- Restore test completed.
- Owner/principal or named approver approves production deploy.
- Production writes remain blocked unless a later release phase explicitly approves them.
