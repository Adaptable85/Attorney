# Staging Resource Creation Report

Date/time: 2026-06-23 15:22:36 SAST

Phase 5G note: this report is retained as historical evidence for the Phase 5E Neon CLI blocker. ADR 0010 supersedes the Neon database-provider direction with Supabase Postgres. No Vercel, Neon or Supabase resource was created by this report.

## Summary

Phase 5E attempted to begin staging-only Vercel + Neon resource creation from the local Attorney workspace. Resource creation was blocked because the required provider CLIs are not installed in this execution environment.

No Vercel resources were created. No Neon resources were created. No deployment was run. No production database or production resource was touched.

## Vercel Result

- CLI check command: `which vercel || true`
- Result: `vercel not found`
- Auth check command: `vercel whoami || true`
- Result: `zsh:2: command not found: vercel`
- Resource result: blocked before resource inspection or creation.
- Staging URL: none created.

## Neon Result

- CLI check command: `which neonctl || true`
- Result: `neonctl not found`
- Auth check command: `neonctl auth status || true`
- Result: `zsh:2: command not found: neonctl`
- Resource result: blocked before resource inspection or creation.
- Staging database/branch: none created.

## Environment Variables

No Vercel environment variables were configured because Vercel CLI access is unavailable.

Approved staging variable names remain:

- `DATABASE_URL`
- `AUTH_PROVIDER`
- `AUTH_ENTRA_TENANT_ID`
- `AUTH_ENTRA_CLIENT_ID`
- `AUTH_ENTRA_CLIENT_SECRET`
- `AUTH_ENTRA_REDIRECT_URI`
- `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS`
- `AUTH_ENTRA_ROLE_CLAIM`
- `AUTH_PRODUCTION_READY`
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED`
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED`
- `BURGESS_AUDITED_PERSISTENCE_ENABLED`
- `BURGESS_LOCAL_DEV_WRITES_ENABLED`
- `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED`
- `BURGESS_PRODUCTION_WRITES_ENABLED`
- `BURGESS_PRODUCTION_AUTH_PROVIDER`
- `BURGESS_PRODUCTION_AUTH_ENABLED`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED`

No secret values were printed, stored or committed.

## Migration Status

- Staging migration was not run.
- Reason: Neon staging database was not created and no staging `DATABASE_URL` was available.
- `db:push` was not run.
- Production migration was not run.
- Destructive reset was not run.

## Safety Confirmations

- `AUTH_PRODUCTION_READY` remains false/not configured for staging.
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED` remains false/not configured.
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED` remains false/not configured.
- `BURGESS_LOCAL_DEV_WRITES_ENABLED` remains false/not configured.
- `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED` remains false/not configured.
- `BURGESS_PRODUCTION_WRITES_ENABLED` remains false/not configured.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No production Vercel project was created.
- No production Neon database was created.
- No production domain was added.
- No real Burgess client data was used.

## Risks / TODOs

- Install or otherwise make available an approved Vercel CLI session, then rerun the staging-only resource creation procedure.
- Install or otherwise make available an approved Neon CLI session, then rerun the staging-only resource creation procedure.
- Alternatively, create staging resources manually in the Vercel and Neon dashboards and record project IDs, staging URL, database name/branch and secret names in a follow-up report.
- Staging migration remains pending until a Neon staging database exists and a staging-only `DATABASE_URL` is available through approved secret handling.

## Manual Staging Details Follow-Up

Date/time: 2026-06-23

Manual staging details were requested for documentation, but the submitted values were placeholders rather than concrete non-secret resource details. No values were invented.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Vercel project name | Pending manual value | Pending |
| Vercel staging URL | Pending manual value | Pending |
| Neon project name | Pending manual value | Pending |
| Neon region | Pending manual value | Pending |
| Neon database/branch name | Pending manual value | Pending |
| `DATABASE_URL` configured in Vercel | Pending yes/no confirmation; value must not be recorded | Pending |
| All write gates false/off | Pending yes/no confirmation | Pending |
| `AUTH_PRODUCTION_READY=false` | Pending yes/no confirmation | Pending |

Safety status remains unchanged:

- No production resources are recorded as created.
- No production deploy was run.
- No secrets were committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.

## Railway Staging Resource Confirmation

Date/time: 2026-06-24 16:15:24 SAST

Phase 5J confirmed that the approved Railway staging direction has one Railway project and one Railway Postgres database available for staging-only follow-up work. This report records non-secret resource details only.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Railway workspace/account | `adaptable85's Projects` | Confirmed |
| Railway project name | `burgess-attorneys-staging` | Confirmed |
| Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Railway project URL | `https://railway.com/project/46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Railway environment name | `production`; Railway default environment name only, not an approved Attorney production app deployment | Confirmed |
| Railway environment ID | `e227a158-d3c0-455e-b7d6-747f51c80fdb` | Confirmed |
| Railway Postgres service name | `Postgres` | Confirmed |
| Railway Postgres service ID | `a4293b3b-f036-4ff4-ab3e-584598007a0b` | Confirmed |
| Railway Postgres status | `Online` | Confirmed |
| Railway Postgres image | `ghcr.io/railwayapp-templates/postgres-ssl:18` | Confirmed |
| Railway Postgres volume | `postgres-volume` | Confirmed |
| Railway region | `sfo` | Confirmed |
| Railway Postgres deployment ID | `8a6e8714-c85c-4b1b-b3c9-22439f1edce2` | Confirmed |
| `DATABASE_URL` available inside Railway | Yes; value not recorded | Confirmed |
| Railway app service created | No | Pending |
| Railway app deployed | No | Pending |
| Staging migration | Not run | Pending |
| Environment gates configured | Not yet configured | Pending |
| Production domain | Not added | Confirmed |

Safety status:

- No Attorney app deploy was run.
- No production deploy was run.
- No production domain was added.
- No production database command or production migration was run.
- `db:push` was not run.
- No secrets, database URLs, database passwords, Railway tokens, private keys or Microsoft client secrets were printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No Vercel, Supabase or Neon resources were created in this phase.

Known risk:

- `railway list` reportedly shows two projects named `burgess-attorneys-staging`.
- The active linked Railway project for this setup is `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- Do not delete or modify any duplicate Railway project in this phase.

Next recommendation:

- Resolve or document the duplicate project naming risk if needed.
- Create the Railway app service only after explicit approval.
- Configure safe/off environment gates before any staging deploy or staging migration.
- Keep migration status pending until the app service and staging environment variables are explicitly approved.

## Railway App Service And Safe Gate Confirmation

Date/time: 2026-06-24 16:24:53 SAST

Phase 5K created and confirmed an empty Railway app service for the Attorney staging app and configured only explicit safe/off environment gate values. No app deployment, migration or production command was run.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Railway app service created/confirmed | Yes | Confirmed |
| Railway app service name | `attorney-web` | Confirmed |
| Railway app service ID | `de7fc164-c220-4d5a-8c91-754423f8e994` | Confirmed |
| Railway app service source | None; no GitHub repo or image connected | Confirmed |
| Railway app deployment ID | None | Confirmed not deployed |
| Railway app URL/domain | None | Confirmed not added |
| Safe/off env gates configured | Yes | Confirmed |
| `DATABASE_URL` linkage | Pending; no value recorded | Pending |
| Staging migration | Not run | Pending |
| Production domain | Not added | Confirmed |

Configured non-secret app service values:

```text
AUTH_PROVIDER=entra
AUTH_PRODUCTION_READY=false
BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false
BURGESS_CLIENT_MATTER_WRITES_ENABLED=false
BURGESS_LOCAL_DEV_WRITES_ENABLED=false
BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false
BURGESS_PRODUCTION_WRITES_ENABLED=false
```

Phase 5K safety status:

- No Attorney app deploy was run.
- No production deploy was run.
- No production domain was added.
- No staging migration, production migration or `db:push` was run.
- No Railway Postgres `DATABASE_URL`, database password, Railway token, Microsoft client secret or private key was printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- Duplicate Railway project risk remains documented; the active linked project remains `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.

Next recommendation:

- Prepare a first safe staging deploy and staging migration plan only after confirming `DATABASE_URL` linkage strategy and retaining all safe/off gates.

## Railway Database Linkage And First Deploy Plan

Date/time: 2026-06-25 09:22:07 SAST

Phase 5L linked `DATABASE_URL` to `attorney-web` using a Railway reference to the existing Railway Postgres service. The raw value was not printed, recorded or committed. This phase prepared a first staging deploy and migration plan only. No app deploy or migration was run.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Railway app service name | `attorney-web` | Confirmed |
| Railway app service ID | `de7fc164-c220-4d5a-8c91-754423f8e994` | Confirmed |
| `DATABASE_URL` linkage | Configured through Railway Postgres reference; value not recorded | Confirmed |
| Safe/off env gates | Configured on `attorney-web` | Confirmed |
| Railway app deployment ID | None | Confirmed not deployed |
| Railway app URL/domain | None | Confirmed not added |
| Staging migration | Not run | Pending |
| First staging deploy plan | Prepared only | Pending approval |
| First staging migration plan | Prepared only | Pending approval |

First staging deploy preconditions:

- Active Railway project ID remains `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
- `attorney-web` is selected as the target service.
- `DATABASE_URL` is linked from Railway Postgres without exposing the value.
- `AUTH_PRODUCTION_READY=false`.
- All write gates remain false/off.
- No production domain is attached.
- No real Burgess client data is loaded.
- Create forms remain disabled.
- Live Microsoft Entra auth remains disabled.

First deploy command for later explicit approval:

```sh
railway up
```

First staging migration command for later explicit approval:

```sh
railway run pnpm exec prisma migrate deploy
```

The migration command may be used only if Railway injects the approved `attorney-web` service environment safely and the target database is confirmed as Railway Postgres staging. Do not run it in this planning phase.

Explicitly forbidden during first deploy/migration approval:

- Do not run `db:push`.
- Do not run destructive migration reset commands.
- Do not run production migrations.
- Do not use a production database.
- Do not enable live auth.
- Do not enable UI saves.
- Do not enable production writes.

Rollback and check plan:

- Capture the Railway deployment reference before smoke testing.
- Check Railway deployment logs and runtime logs.
- Check the health page if available.
- Stop if build or runtime checks fail.
- Do not retry by loosening auth/write gates.
- Do not run rollback migrations without an approved recovery plan.

Phase 5L safety status:

- No Attorney app deploy was run.
- No staging migration, production migration or `db:push` was run.
- No production deploy or production domain was added.
- No Railway Postgres `DATABASE_URL`, database password, Railway token, Microsoft client secret or private key was printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- Duplicate Railway project risk remains documented; the active linked project remains `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`.
