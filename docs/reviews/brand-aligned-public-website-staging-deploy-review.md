# Brand-Aligned Public Website Staging Deploy Review

Date/time: 2026-06-26 13:01:10 SAST

## Scope

Phase 6D deployed the merged brand-aligned Burgess Attorneys public website to the existing Railway staging app service `attorney-web`. This was a staging app deploy only. It did not run migrations, `db:push`, DNS changes, custom domain setup, live auth enablement, UI saves or production writes.

## Deployment

| Item | Result |
| --- | --- |
| Repo commit deployed | `edf18df feat(public): align website with Burgess brand (#20)` |
| Railway project | `burgess-attorneys-staging` |
| Railway project ID | `46a94859-6ba1-47b8-8e64-4b66a90dc3fa` |
| Railway environment | `production` Railway environment name; staging use only |
| Target service | `attorney-web` |
| Deployment ID | `77e9131b-71a3-4474-a4fa-65a96b285162` |
| Staging URL | `https://attorney-web-production.up.railway.app` |
| Deploy command | `railway up --service attorney-web --message "Phase 6D deploy brand-aligned Burgess website to staging"` |
| Deploy result | Railway deployment reached `SUCCESS` and the runtime instance reported `RUNNING` |

## Pre-Deploy Validation

The following local checks passed before deployment:

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm test` (`69` files, `338` tests)
- `pnpm run test:coverage` (`96.29%` statements, `90.04%` branches)
- `pnpm run prisma:validate`
- `pnpm run build`
- `./scripts/check-agent-context.sh`
- `./scripts/check-adr-needed.sh`
- `./scripts/pre-pr-review.sh`
- `pnpm run test:db:local` (`7` files, `13` tests)

## Environment Gate Check

Railway variables were checked by name/status only. Secret values were not printed or recorded.

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

## Read-Only Smoke Checks

| Route | Result |
| --- | --- |
| `/` | `200`; Burgess Attorneys brand text, official logo asset path and navigation labels present |
| `/about` | `200` |
| `/services` | `200` |
| `/team` | `200` |
| `/testimonials` | `200` |
| `/contact` | `200`; static contact details visible |
| `/api/health` | Returned `{"ok":true,"phase":"0","scope":"technical-foundation"}` |
| `/admin` | `200`; safe unauthenticated `Not authorized` state |

Homepage markers confirmed:

- `Burgess Attorneys`
- `/brand/burgess-logo-header.png`
- `Home`
- `About Us`
- `Services`
- `Our Team`
- `Testimonials`
- `Contact Us`

Contact page safety:

- Current static contact content was visible.
- No `<form>` tag was observed in fetched HTML.
- No submit control was observed in fetched HTML.
- No contact form backend was enabled or tested.

Admin/backend safety:

- `/admin` remains blocked for unauthenticated access.
- No admin workflow was used.
- No client, matter, invoice, WhatsApp, Lexpro or email workflow was started.

## Safety Status

- Migration: not run.
- `db:push`: not run.
- Production database command: not run.
- Production migration: not run.
- Custom/production domain: not added.
- DNS: not changed.
- `burgessinc.co.za` DNS: not touched.
- Secrets: not committed, printed or recorded.
- Railway tokens: not printed or recorded.
- `DATABASE_URL`: not printed or recorded.
- Live Microsoft Entra auth: disabled.
- UI saves: disabled.
- Production writes: blocked.
- Real Burgess client data: not entered.
- Command Center: not touched.

## Recommendation

Open a review PR for this deploy record. After review and merge, Stephanie can review the brand-aligned public website on the Railway staging URL. Any website feedback should be handled before custom domain or DNS work is considered.
