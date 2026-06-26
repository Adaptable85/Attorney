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

## Railway Railpack Build Failure Diagnosis And Start Config

Date/time: 2026-06-25 10:01:02 SAST

Phase 5N diagnosed the failed Railway staging deployment `39710650-fe18-4bf9-a6ea-a068a6c0d57e` and prepared a minimal start-command configuration for review. No deploy retry, migration or database push was run.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Railway deployment diagnosed | `39710650-fe18-4bf9-a6ea-a068a6c0d57e` | Confirmed |
| Failure type | Railpack missing start command | Confirmed |
| Local package manager | `pnpm` | Confirmed |
| Local build script | `pnpm run build` | Confirmed |
| Start script before Phase 5N | Missing | Confirmed |
| Start script prepared | `pnpm start` | Pending review |
| Railway config prepared | `railway.json` with Railpack builder and `pnpm start` deploy command | Pending review |
| Deploy retry | Not run | Confirmed |
| Migration | Not run | Confirmed |
| `db:push` | Not run | Confirmed |
| Staging URL | None | Pending |
| Production domain | Not added | Confirmed |

Safety status remains unchanged:

- No production deploy was run.
- No Railway deploy retry was run.
- No production database command or production migration was run.
- No secrets, `DATABASE_URL` values, database passwords, Railway tokens, private keys or Microsoft client secrets were printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.

Next recommendation:

- Open a review PR for the start-command/config fix.
- Retry the Railway staging deploy only after the fix is reviewed and merged.

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

## First Controlled Railway Staging Deploy Attempt

Date/time: 2026-06-25 09:43:11 SAST

Phase 5M attempted the first controlled Railway staging deploy to `attorney-web` only. The deploy did not complete successfully. Railway/Railpack failed the build before runtime because no start command was detected. No staging URL was created and no runtime smoke test was possible.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Target service | `attorney-web` | Confirmed |
| Railway app service ID | `de7fc164-c220-4d5a-8c91-754423f8e994` | Confirmed |
| Deploy command | `railway up --service attorney-web --message "Phase 5M first controlled Attorney staging deploy"` | Attempted |
| Deployment ID | `39710650-fe18-4bf9-a6ea-a068a6c0d57e` | Failed |
| Build status | Failed: Railpack detected Node/pnpm but no start command | Failed |
| Runtime status | Not started; zero running replicas | Failed |
| Generated Railway staging URL | None | Not available |
| Staging migration | Not run | Pending |
| Production domain | Not added | Confirmed |

Pre-deploy validation passed before the attempt:

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm test`
- `pnpm run test:coverage`
- `pnpm run prisma:validate`
- `pnpm run build`
- `./scripts/check-agent-context.sh`
- `./scripts/check-adr-needed.sh`
- `./scripts/pre-pr-review.sh`
- `pnpm run test:db:local`

Phase 5M safety status:

- No Prisma migration was run.
- `db:push` was not run.
- No production deploy or production/custom domain was added.
- No Railway Postgres `DATABASE_URL`, database password, Railway token, Microsoft client secret or private key was printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No real Burgess client data was used.

Next recommendation:

- Add or configure a Railway-compatible start command in a separate reviewed phase.
- Keep all auth/write gates false/off.
- Reattempt staging deploy only after the start-command fix is reviewed and merged.
- Run staging Prisma migration only in a separate explicitly approved phase after the app deploy is healthy.

## Controlled Railway Staging Deploy Retry

Date/time: 2026-06-25 10:17:43 SAST

Phase 5O retried the controlled Railway staging deploy to `attorney-web` after the reviewed start-command fix was merged. The deployment completed successfully and the Railway service reported online. No Prisma migration, `db:push`, production database command, production migration, production/custom domain or secret change was run.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Target service | `attorney-web` | Confirmed |
| Railway app service ID | `de7fc164-c220-4d5a-8c91-754423f8e994` | Confirmed |
| Deploy command | `railway up --service attorney-web --message "Phase 5O controlled Attorney staging deploy retry after start config"` | Completed |
| Deployment ID | `7c05f3a4-38b4-489c-a1a7-f97b3e02426f` | Success |
| Build status | Railpack detected Node/pnpm, used `railway.json`, ran `pnpm run build` successfully | Success |
| Runtime status | Online; Next.js started with `pnpm start` and reported ready | Success |
| Generated Railway staging URL | Not confirmed by CLI output | Pending |
| Staging migration | Not run | Pending |
| Production domain | Not added | Confirmed |

Pre-deploy validation passed before the retry:

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm test`
- `pnpm run test:coverage`
- `pnpm run prisma:validate`
- `pnpm run build`
- `./scripts/check-agent-context.sh`
- `./scripts/check-adr-needed.sh`
- `./scripts/pre-pr-review.sh`
- `pnpm run test:db:local`

Safe/off environment gate names were confirmed on `attorney-web` before deploy without printing values:

- `DATABASE_URL` is configured by Railway reference; raw value not printed or recorded.
- `AUTH_PROVIDER=entra`.
- `AUTH_PRODUCTION_READY=false`.
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false`.
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED=false`.
- `BURGESS_LOCAL_DEV_WRITES_ENABLED=false`.
- `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false`.
- `BURGESS_PRODUCTION_WRITES_ENABLED=false`.

Phase 5O safety status:

- No Prisma migration was run.
- `db:push` was not run.
- No production deploy or production/custom domain was added.
- No Railway Postgres `DATABASE_URL`, database password, Railway token, Microsoft client secret or private key was printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No real Burgess client data was used.

Next recommendation:

- Open a review PR for this Phase 5O result documentation.
- If a public Railway staging URL is required, approve a separate Railway-generated staging domain step.
- Approve Railway staging migration separately only after confirming the online app target, database target and rollback plan.

## Railway-Provided Staging URL

Date/time: 2026-06-26 10:10:57 SAST

Phase 5P generated a Railway-provided staging URL for `attorney-web` only. No deploy, migration, `db:push`, production database command, production migration, custom domain, DNS change or secret change was run.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Target service | `attorney-web` | Confirmed |
| Railway app service ID | `de7fc164-c220-4d5a-8c91-754423f8e994` | Confirmed |
| Deployment ID | `7c05f3a4-38b4-489c-a1a7-f97b3e02426f` | Online |
| Railway-provided staging URL | `https://attorney-web-production.up.railway.app` | Generated |
| URL type | Railway-generated `*.up.railway.app`; not a custom or production Burgess domain | Confirmed |
| App root | `200 OK` | Passed |
| Admin route | `200 OK`; rendered safe not-authorized/admin state | Passed |
| Health endpoint | `200 OK`; returned `{"ok":true,"phase":"0","scope":"technical-foundation"}` | Passed |
| Create/save routes | Returned safe not-authorized state; no submit/action markers found in fetched HTML | Passed |
| Database/schema error | None observed in read-only smoke checks | Not observed |
| Staging migration | Not run | Pending |
| Production/custom domain | Not added | Confirmed |

Phase 5P safety status:

- No Railway deploy was run.
- No Prisma migration was run.
- `db:push` was not run.
- No production database command or production migration was run.
- No production/custom domain or DNS change was added.
- No Railway Postgres `DATABASE_URL`, database password, Railway token, Microsoft client secret or private key was printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No real Burgess client data was used.

Next recommendation:

- Open a review PR for this Phase 5P result documentation.
- Proceed to a staging review checklist if the Railway URL remains healthy.
- Approve Railway staging migration separately only if later staging checks require database-backed routes.

## Railway Staging Read-Only Review

Date/time: 2026-06-26 10:26:00 SAST

Phase 5Q performed a read-only staging review of `https://attorney-web-production.up.railway.app`. No deploy, migration, `db:push`, production database command, production migration, custom/production domain or secret change was run.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Staging URL reviewed | `https://attorney-web-production.up.railway.app` | Confirmed |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Target service | `attorney-web` | Confirmed |
| Root route | `200 OK` | Passed |
| Health endpoint | `200 OK`; technical-foundation payload | Passed |
| Admin routes | `200 OK`; safe not-authorized state | Passed |
| Create client route | `200 OK`; safe not-authorized state; no active submit/action markers observed | Passed |
| Create matter route | `200 OK`; safe not-authorized state; no active submit/action markers observed | Passed |
| Matter detail route | `200 OK`; safe not-authorized state | Passed |
| Entra login/callback | `503`; live Entra auth not enabled | Passed |
| Entra logout `GET` | `405` | Passed |
| Database/schema error | None observed | Not observed |
| Staging migration | Not run | Pending |
| Production/custom domain | Not added | Confirmed |

Phase 5Q safety status:

- No deploy was run.
- No Prisma migration was run.
- `db:push` was not run.
- No production database command or production migration was run.
- No Railway Postgres `DATABASE_URL`, database password, Railway token, Microsoft client secret or private key was printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No real Burgess client data was used.

Next recommendation:

- Continue staging UX/read-only review.
- Do not run staging migration yet because the read-only routes did not show schema errors.
