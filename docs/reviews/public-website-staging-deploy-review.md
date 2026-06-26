# Public Website Staging Deploy Review

Date/time: 2026-06-26 12:15:07 SAST

## Scope

Phase 6B deployed the merged public Burgess Attorneys website to the existing Railway staging app service and then stopped deployment activity. This review records the result, the read-only smoke checks and the safety status.

## Deployment

| Item | Result |
| --- | --- |
| Railway project | `burgess-attorneys-staging` |
| Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` |
| Railway environment | `production` Railway environment name; staging use only |
| Target service | `attorney-web` |
| Deployment ID | `ce11f354-28a5-4568-8da4-7727623e2d6b` |
| Staging URL | `https://attorney-web-production.up.railway.app` |
| Deploy command | `railway up --service attorney-web --message "Phase 6B deploy public Burgess Attorneys website to staging"` |
| Deploy result | CLI upload timed out after upload, but Railway dashboard showed active deployment and the user visually confirmed the public website was visible |
| Start command | `next start -p ${PORT:-3000}` |

## Read-Only Smoke Checks

| Route | Result |
| --- | --- |
| `/` | `200 OK`; Burgess Attorneys public homepage markers visible |
| `/about` | `200 OK`; public about page markers visible |
| `/services` | `200 OK`; legal services markers visible |
| `/team` | `200 OK`; Stephanie Burgess/team markers visible |
| `/contact` | `200 OK`; contact details visible and no active form markup found |
| `/api/health` | `200 OK`; returned `{"ok":true,"phase":"0","scope":"technical-foundation"}` |
| `/admin` | `200 OK`; rendered safe `Not authorized` state for unauthenticated access |

## Accidental Command Attempts

These commands were attempted after the deploy and are recorded transparently:

- `pnpm exec prisma migrate deploy`: attempted locally, targeted localhost and failed with `P1010: User was denied access`; no Railway migration completed.
- `pnpm run db:push`: failed because the script does not exist; no `db:push` completed.
- `railway deploy`: opened a template prompt and was not completed.
- `railway up`: produced the active staging deployment recorded above.

## Safety Status

- No further deploy was run during this record phase.
- No Railway migration completed.
- No successful `db:push` occurred.
- No production database command or production migration was run.
- No custom or production domain was added.
- DNS was not changed.
- No secrets, raw database URL, database password, Railway token, Microsoft client secret or private key were recorded.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- Admin/backend access remains locked.
- No active contact form backend exists.
- No real Burgess client data was entered.

## Recommendation

Open a review PR for this documentation. After it is reviewed and merged, send Stephanie the staging public website link for review. Decide any website revisions before approving a custom domain or DNS change.
