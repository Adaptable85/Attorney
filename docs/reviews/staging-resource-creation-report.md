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

## Railway Brand-Aligned Public Website Staging Deploy

Date/time: 2026-06-26 13:01:10 SAST

Phase 6D deployed the merged brand-aligned Burgess Attorneys public website to the existing Railway staging app service. This was an app deploy only. No migration, `db:push`, custom domain, DNS change, live auth, UI save or production write was run or enabled.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Railway app service | `attorney-web` | Confirmed |
| Deployment ID | `77e9131b-71a3-4474-a4fa-65a96b285162` | Confirmed |
| Deploy command | `railway up --service attorney-web --message "Phase 6D deploy brand-aligned Burgess website to staging"` | Completed |
| Staging URL | `https://attorney-web-production.up.railway.app` | Confirmed |
| Deployment status | `SUCCESS`, running | Confirmed |
| Public routes | `/`, `/about`, `/services`, `/team`, `/testimonials`, `/contact` returned `200` | Passed |
| `/api/health` | Returned `{"ok":true,"phase":"0","scope":"technical-foundation"}` | Passed |
| `/admin` | Returned `200` with safe unauthenticated `Not authorized` state | Passed |
| Contact form backend | No `<form>` or submit control observed in fetched contact page HTML | Confirmed absent |
| Migration | Not run | Confirmed |
| `db:push` | Not run | Confirmed |
| Custom/production domain or DNS | Not changed | Confirmed |
| Secrets | No secret values recorded | Confirmed |

Configured gate status was checked by name/status only:

```text
DATABASE_URL=present (value redacted)
AUTH_PROVIDER=entra
AUTH_PRODUCTION_READY=false
BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false
BURGESS_CLIENT_MATTER_WRITES_ENABLED=false
BURGESS_LOCAL_DEV_WRITES_ENABLED=false
BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false
BURGESS_PRODUCTION_WRITES_ENABLED=false
```

Safety status:

- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No real Burgess client data was entered.
- No client, matter, invoice, WhatsApp, Lexpro or email workflow was started.

## Phase 8A Read-Only Admin Workspace Status

Date/time: 2026-06-26 16:11:18 SAST

Phase 8A is a local code/documentation phase for the admin review workspace only. It does not create or alter Railway resources, deploy the app, configure Railway variables, run migrations, run `db:push`, change DNS or enable production features.

Staging resource status remains unchanged:

- Railway staging URL remains `https://attorney-web-production.up.railway.app`.
- No new Railway resource is created by Phase 8A.
- No Railway app deploy is approved by Phase 8A.
- Railway Postgres remains untouched by Phase 8A.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.

## Railway Deployed Admin Password Verification

Date/time: 2026-06-26 15:44:04 SAST

Phase 7F records read-only verification of the manually deployed Phase 7E admin password redirect hardening on Railway staging. No deploy, migration, `db:push`, Railway environment change, DNS change or custom/production domain change was run in this phase.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Railway app service | `attorney-web` | Confirmed |
| Deployment ID | `468e1a25-4fe2-45d3-bbd8-a76ba4fefd59` | Confirmed |
| Staging URL | `https://attorney-web-production.up.railway.app` | Confirmed |
| Public routes | `/`, `/about`, `/services`, `/team`, `/testimonials`, `/contact` returned `200` and no public admin links were detected | Passed |
| `/api/health` | Returned `{"ok":true,"phase":"0","scope":"technical-foundation"}` | Passed |
| `/admin` | Returned `200`; user manually confirmed password access and admin shell | Passed |
| Correct-password redirect | Relative `/admin`, manually confirmed | Passed |
| Failure redirect | Relative `/admin/sign-in?error=invalid`, manually confirmed after Phase 7E deploy | Passed |
| Role badge | `Read-Only Reviewer`, manually confirmed | Passed |
| Matters page | Read-only, manually confirmed | Passed |
| `/admin/clients/new` | Blocked/non-writing, manually confirmed | Passed |
| `/admin/matters/new` | Blocked/non-writing, manually confirmed | Passed |
| Save/create/write flow | No active flow, manually confirmed | Passed |
| Migration | Not run | Confirmed |
| `db:push` | Not run | Confirmed |
| Custom/production domain or DNS | Not changed | Confirmed |
| Secrets/cookies | No secret or cookie values recorded | Confirmed |

Safety status:

- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- Demo/placeholder data only was reviewed.
- No real Burgess client data was entered.
- No client, matter, invoice, WhatsApp, Lexpro or email workflow was started.

## Railway Admin Password Redirect Fix Staging Deploy

Date/time: 2026-06-26 14:21:16 SAST

Phase 7D deployed the merged admin password redirect fix to the existing Railway staging app service and verified the admin password access path. This was an app deploy and read-only smoke check only. No migration, `db:push`, custom domain, DNS change, live Microsoft Entra auth, UI save or production write was run or enabled.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Railway app service | `attorney-web` | Confirmed |
| Deployment ID | `5f07b9eb-c988-47d8-9758-29fbc99a4f86` | Confirmed |
| Deploy command | `railway up --service attorney-web --message "Phase 7D deploy admin password redirect fix"` | Completed |
| Deployment status | `SUCCESS` | Confirmed |
| Staging URL | `https://attorney-web-production.up.railway.app` | Confirmed |
| Public routes | `/`, `/about`, `/services`, `/team`, `/testimonials`, `/contact` returned `200` and no public admin links were detected | Passed |
| `/api/health` | Returned `{"ok":true,"phase":"0","scope":"technical-foundation"}` | Passed |
| `/admin` without session | Returned `200` with password screen | Passed |
| Incorrect password POST | Returned no session cookie and did not grant access | Passed |
| Correct password POST | Returned `303` with relative `Location: /admin`; no `localhost` in the successful redirect | Passed |
| Cookie-backed `/admin` | Returned `200` with admin shell and `Read-Only Reviewer` | Passed |
| `/admin/clients/new` | Returned `200` but remained blocked/disabled with no active save detected | Passed |
| `/admin/matters/new` | Returned `200` but remained blocked/disabled with no active save detected | Passed |
| Entra login/callback | `/api/auth/entra/login` and `/api/auth/entra/callback` returned `503` | Passed |
| Migration | Not run | Confirmed |
| `db:push` | Not run | Confirmed |
| Custom/production domain or DNS | Not changed | Confirmed |
| Secrets | No secret values recorded | Confirmed |

Configured gate status was checked by name/status only:

```text
BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED=present true
BURGESS_ADMIN_PASSWORD=present; value not recorded
BURGESS_ADMIN_SESSION_SECRET=present; value not recorded
DATABASE_URL=present; value not recorded
AUTH_PROVIDER=present
AUTH_PRODUCTION_READY=false
BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false
BURGESS_CLIENT_MATTER_WRITES_ENABLED=false
BURGESS_LOCAL_DEV_WRITES_ENABLED=false
BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false
BURGESS_PRODUCTION_WRITES_ENABLED=false
```

Operational note:

- The `DATABASE_URL` value exists in Railway and was not printed or recorded. The CLI redacted check saw it as a direct Postgres URL rather than a literal Railway reference expression, so a future environment hygiene pass should decide whether to convert it to a Railway variable reference.
- Incorrect-password redirect behavior remains generic and non-authenticating, but the redirect header still resolves through the internal request host. That path grants no access and sets no cookie; a later small hardening phase may make the failure redirect relative as well.

Safety status:

- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No real Burgess client data was entered.
- No client, matter, invoice, WhatsApp, Lexpro or email workflow was started.

## Phase 7A Admin Password Access Preparation

Date/time: 2026-06-26

Phase 7A prepares a staging/review-only password gate for the admin area. It records environment variable names only and does not configure Railway secrets, deploy, run migrations or enable writes.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Public admin link | No public header/footer link to `/admin` is expected | Guarded by tests |
| Password access gate | `BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED` | Defaults off |
| Password value | `BURGESS_ADMIN_PASSWORD` | Not recorded |
| Session secret | `BURGESS_ADMIN_SESSION_SECRET` | Not recorded |
| Password-session role | `READ_ONLY_REVIEWER` | Read-only |
| Microsoft Entra live auth | Not enabled | Confirmed |
| UI saves | Not enabled | Confirmed |
| Production writes | Not enabled | Confirmed |
| Migration | Not run | Confirmed |
| `db:push` | Not run | Confirmed |
| Deploy | Not run | Confirmed |

Next recommendation:

- Review and merge the Phase 7A password-gate PR.
- Configure the password and session secret in Railway only in a later approved phase.
- Deploy only after the Railway env variables are configured and reviewed.

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

## Client-Facing Staging Review Pack

Date/time: 2026-06-26 10:39:03 SAST

Phase 5R prepared a client-facing staging review pack for Stephanie Burgess. It explains the live staging URL, what can be safely reviewed, what remains intentionally disabled, and what decisions are needed before enabling login, real data or production workflows.

Files prepared:

- `docs/client/stephanie-staging-review-pack.md`
- `docs/client/stephanie-staging-review-email-draft.md`

Safety status remains unchanged:

- No deploy was run.
- No migration was run.
- `db:push` was not run.
- No production database command or production migration was run.
- No custom/production domain was added.
- No secrets, raw database URL, database password, Railway token or Microsoft client secret were printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.

Next recommendation:

- Open a review PR for the Phase 5R client-facing pack.
- After merge, send Stephanie the reviewed email draft and staging link.

## Public Website Staging Deploy

Date/time: 2026-06-26 12:15:07 SAST

Phase 6B deployed the merged public Burgess Attorneys website to the existing Railway staging app service. No further deploy, migration, `db:push`, production database command, production migration, custom/production domain, DNS change or secret change should be run as part of this record phase.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Target service | `attorney-web` | Confirmed |
| Railway service status | Online | Confirmed |
| Deployment ID | `ce11f354-28a5-4568-8da4-7727623e2d6b` | Active |
| Staging URL | `https://attorney-web-production.up.railway.app` | Confirmed |
| Deploy command used | `railway up --service attorney-web --message "Phase 6B deploy public Burgess Attorneys website to staging"` | Completed with CLI timeout after upload |
| Deploy result | Railway dashboard showed active deployment and the user confirmed the public site was visible | Passed |
| Start command | `next start -p ${PORT:-3000}` | Confirmed from deployment view |
| `/` | `200 OK`; public homepage markers visible | Passed |
| `/about` | `200 OK`; public about page markers visible | Passed |
| `/services` | `200 OK`; service page markers visible | Passed |
| `/team` | `200 OK`; Stephanie/team markers visible | Passed |
| `/contact` | `200 OK`; contact page markers visible; no active form markup found | Passed |
| `/api/health` | `200 OK`; returned `{"ok":true,"phase":"0","scope":"technical-foundation"}` | Passed |
| `/admin` | `200 OK`; rendered safe `Not authorized` state for unauthenticated access | Passed |
| Staging migration | Not run successfully; remains pending separate approval | Pending |
| `db:push` | Not run successfully; no such script exists | Blocked |
| Production/custom domain | Not added | Confirmed |

Accidental command attempts recorded transparently:

- `pnpm exec prisma migrate deploy` was attempted locally and targeted localhost. It failed with `P1010: User was denied access`; no Railway migration completed.
- `pnpm run db:push` was attempted and failed because no such package script exists; no `db:push` completed.
- `railway deploy` opened a template prompt and was not completed.
- `railway up` produced the active staging deployment listed above.

Phase 6B safety status:

- No additional deploy was run during this record phase.
- No Railway migration completed.
- No successful `db:push` occurred.
- No production database command or production migration was run.
- No custom/production domain or DNS change was added.
- No Railway Postgres `DATABASE_URL`, database password, Railway token, Microsoft client secret or private key was printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No real Burgess client data was entered.
- No active contact form backend exists.

Next recommendation:

- Open a review PR for this Phase 6B result documentation.
- After merge, send Stephanie the Railway staging URL for public website review.
- Decide revisions before any custom domain or DNS change.

## Phase 8B Admin Review Workspace Staging Deploy

Date/time: 2026-06-26 16:37:54 SAST

Phase 8B deployed the merged Phase 8A read-only admin review workspace to the existing Railway staging app service. This was an app deploy only. No migration, `db:push`, production database command, Railway environment variable change, DNS change, custom/production domain change, live auth, UI save or production write was run or enabled.

| Item | Non-secret value recorded | Status |
| --- | --- | --- |
| Active Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` | Confirmed |
| Railway app service | `attorney-web` | Confirmed |
| Deployment ID | `e4e41b91-cfc8-42db-b0a9-771c77219b1a` | `SUCCESS` |
| Deploy command | `railway up --service attorney-web --message "Phase 8B deploy read-only admin review workspace"` | Completed |
| Staging URL | `https://attorney-web-production.up.railway.app` | Confirmed |
| Public routes | `/`, `/about`, `/services`, `/team`, `/testimonials`, `/contact` returned `200` | Passed |
| `/api/health` | Returned `{"ok":true,"phase":"0","scope":"technical-foundation"}` | Passed |
| Admin workspace | `/admin` rendered the read-only review workspace after password sign-in | Passed |
| Admin section routes | Dashboard, clients, matters, documents, billing, Lexpro, audit and access returned `200` with read-only content | Passed |
| Create routes | `/admin/clients/new` and `/admin/matters/new` remained blocked/non-writing | Passed |
| Live Entra routes | Login and callback returned disabled `503` responses | Passed |
| Migration | Not run | Confirmed |
| `db:push` | Not run | Confirmed |
| Custom/production domain or DNS | Not changed | Confirmed |
| Secrets | No secret values recorded | Confirmed |

Safety status:

- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No payment gateway, Yoco, Payfast, shop, checkout or membership functionality was added.
- No real Burgess client data was entered.
- No client, matter, invoice, WhatsApp, Lexpro or email workflow was started.
