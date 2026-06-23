# Staging Resource Creation Report

Date/time: 2026-06-23 15:22:36 SAST

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
