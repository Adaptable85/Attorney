# Staging Resource Creation Runbook

Status: Phase 5G runbook update
Date: 2026-06-23

This runbook describes how staging resources should be created later after explicit approval. It does not create Vercel resources, create Supabase resources, deploy, add secrets, run migrations, enable live auth, enable UI saves or enable production writes.

ADR 0010 supersedes the earlier Neon database-provider direction with Supabase Postgres. Use Supabase as managed PostgreSQL only; Supabase Auth and Supabase Storage are not approved by this runbook.

## A. Preconditions

- GitHub `main` is clean and synced with `origin/main`.
- No unmerged PR is required for the staging setup run.
- Vercel account/team is confirmed.
- Supabase account/project owner is confirmed.
- Burgess Microsoft Entra tenant access is pending or confirmed and recorded.
- Domain/DNS owner is identified.
- Staging URL is approved.
- Staging data policy is accepted: no real client data.
- Production writes are not enabled.
- Production domain is not connected.
- Production database is not created or touched unless a separate approval explicitly allows it.
- Deployment approver, migration runner and environment variable owner are named.

## B. Vercel Staging Setup Steps

1. Create or import a Vercel project from the GitHub repository after approval.
2. Recommended project name: `burgess-attorneys-admin`.
3. Select the Next.js framework preset.
4. Use install command:

   ```sh
   pnpm install --frozen-lockfile
   ```

5. Use build command:

   ```sh
   pnpm run build
   ```

6. Keep root directory as repository root unless Vercel detection or a later approved repo layout requires otherwise.
7. Configure preview/staging branch strategy before enabling deployments.
8. Add environment variables as placeholders first, then approved staging values only in Vercel environment settings.
9. Choose function region close to the selected Supabase region where practical.
10. Do not add a production domain.
11. Do not run a production deploy.
12. Restrict project access to approved maintainers.
13. Confirm logs do not print secret values.

## C. Supabase Staging Setup Steps

1. Create a Supabase project after approval.
2. Recommended project name: `burgess-attorneys-staging`.
3. Choose and record the region.
4. Confirm the staging Postgres database/branch.
5. Recommended staging database/branch name: `staging`.
6. Store the connection string only in secure Vercel environment variables.
7. Do not commit connection strings.
8. Use fake/test data only.
9. Confirm backup and restore settings.
10. Confirm runtime and migration roles if separate roles are available.
11. Do not create a production database unless explicitly approved in a separate production step.
12. Do not enable Supabase Auth, Supabase Storage, generated APIs or public object storage.

## D. Migration Process For Staging

- Run `pnpm run prisma:validate` before migrations.
- Use reviewed Prisma migrations only.
- Use staging `DATABASE_URL` from the approved secret store only for staging migration commands.
- Expected staging migration command after approval:

  ```sh
  pnpm exec prisma migrate deploy
  ```

- Never use `db:push`.
- Do not run destructive reset commands.
- Record migration command, target database, result and timestamp.
- Run staging smoke checklist after migration.
- If migration fails, stop and preserve logs.
- Use rollback or forward-fix notes reviewed before rerunning migrations.

## E. Environment Variables

Use placeholders only in documentation. Real values belong only in approved provider secret stores.

Required staging values:

- `DATABASE_URL=<supabase-staging-postgres-url>`
- `AUTH_PROVIDER=entra`
- `AUTH_ENTRA_TENANT_ID=<staging-tenant-id>`
- `AUTH_ENTRA_CLIENT_ID=<staging-client-id>`
- `AUTH_ENTRA_CLIENT_SECRET=<staging-client-secret>`
- `AUTH_ENTRA_REDIRECT_URI=https://<staging-app-url>/api/auth/entra/callback`
- `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS=<approved-staging-domain>`
- `AUTH_ENTRA_ROLE_CLAIM=roles`
- `AUTH_PRODUCTION_READY=false`
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false`
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED=false`
- `BURGESS_AUDITED_PERSISTENCE_ENABLED=false`
- `BURGESS_LOCAL_DEV_WRITES_ENABLED=false`
- `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false`
- `BURGESS_PRODUCTION_WRITES_ENABLED=false`
- `BURGESS_PRODUCTION_AUTH_PROVIDER=microsoft_entra_id`
- `BURGESS_PRODUCTION_AUTH_ENABLED=false`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED=false`

Entra staging wiring remains disabled unless a later live-auth staging phase explicitly approves it.

All Burgess feature/write gates remain false/off unless a later fake-data staging-write phase explicitly approves a narrower setting.

## F. First Staging Smoke Checklist

- App root loads.
- `/api/health` responds.
- `/admin` shell loads.
- `/admin/dashboard` loads.
- `/admin/clients` loads.
- `/admin/matters` loads.
- Entra login/callback/logout routes remain disabled unless a later live-auth phase approves them.
- No write gates are enabled.
- Create forms remain disabled.
- No real client data appears.
- Logs show no secret leakage.
- Staging database connection uses only the staging Supabase Postgres database.

## G. Rollback / Cleanup

- Remove Vercel preview/staging environment variables if they were misconfigured.
- Disconnect staging database from Vercel if the wrong database was attached.
- Rotate any credential that may have been exposed.
- Delete the Supabase staging project/database if needed and approved.
- Remove Vercel project if it was created incorrectly and no longer needed.
- Keep an audit note of actions taken, owners, timestamps, cleanup and remaining risks.
- Do not run production cleanup commands from this staging runbook.
