# Admin Password Staging Access Review

Date/time: 2026-06-26 14:21:16 SAST

## Scope

Phase 7D redeployed the merged Phase 7C admin password redirect fix to Railway staging and verified the staging admin password access path. This review records non-secret deployment and smoke-check results only.

No migration, `db:push`, production database command, DNS change, custom/production domain change, live Microsoft Entra auth, UI save or production write was run or enabled.

## Railway Target

| Item | Result |
| --- | --- |
| Project | `burgess-attorneys-staging` |
| Project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` |
| Service | `attorney-web` |
| Service ID | `de7fc164-c220-4d5a-8c91-754423f8e994` |
| Staging URL | `https://attorney-web-production.up.railway.app` |
| Deployment ID | `5f07b9eb-c988-47d8-9758-29fbc99a4f86` |
| Deployment status | `SUCCESS` |

## Environment Status

The following Railway environment variable names were confirmed without printing secret values:

```text
BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED
BURGESS_ADMIN_PASSWORD
BURGESS_ADMIN_SESSION_SECRET
DATABASE_URL
AUTH_PROVIDER
AUTH_PRODUCTION_READY
BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED
BURGESS_CLIENT_MATTER_WRITES_ENABLED
BURGESS_LOCAL_DEV_WRITES_ENABLED
BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED
BURGESS_PRODUCTION_WRITES_ENABLED
```

Gate status:

- `BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED=true`
- `AUTH_PRODUCTION_READY=false`
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false`
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED=false`
- `BURGESS_LOCAL_DEV_WRITES_ENABLED=false`
- `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false`
- `BURGESS_PRODUCTION_WRITES_ENABLED=false`

Secret values were not printed or recorded. `DATABASE_URL` was present and not printed. The CLI redacted check indicated it is stored as a direct Postgres URL rather than a literal Railway reference expression, so a future environment hygiene pass should decide whether to convert it to a Railway reference.

## Deploy

Command used:

```sh
railway up --service attorney-web --message "Phase 7D deploy admin password redirect fix"
```

Result:

- Deployment `5f07b9eb-c988-47d8-9758-29fbc99a4f86` reached `SUCCESS`.
- No migration was run.
- `db:push` was not run.
- No DNS or custom domain change was made.

## Public Route Smoke

| Route | Result |
| --- | --- |
| `/` | `200`, no admin link detected |
| `/about` | `200`, no admin link detected |
| `/services` | `200`, no admin link detected |
| `/team` | `200`, no admin link detected |
| `/testimonials` | `200`, no admin link detected |
| `/contact` | `200`, no admin link detected |
| `/api/health` | `{"ok":true,"phase":"0","scope":"technical-foundation"}` |

## Admin Access Smoke

| Check | Result |
| --- | --- |
| `/admin` without session | `200`, password screen rendered |
| Incorrect password POST | `307`, no session cookie |
| Correct password POST | `303`, `Location: /admin` |
| Correct password redirect includes `localhost` | No |
| Correct password session cookie | Present; value not recorded |
| `/admin` with cookie | `200`, admin shell rendered |
| Role display | `Read-Only Reviewer` |
| `/admin/clients/new` | `200`, blocked/disabled, no active save detected |
| `/admin/matters/new` | `200`, blocked/disabled, no active save detected |
| `/api/auth/entra/login` | `503` |
| `/api/auth/entra/callback` | `503` |

## Safety Result

- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- Client and matter create routes remain non-writing.
- No real Burgess client data was entered.
- No client, matter, invoice, WhatsApp, Lexpro or email workflow was started.
- No password, session secret, raw database URL, Railway token, private key or Microsoft client secret was recorded.

## Follow-Up

- Open and review the Phase 7D documentation PR.
- Consider a small future hardening phase to make the incorrect-password failure redirect relative as well. It currently sets no session cookie and grants no access.
