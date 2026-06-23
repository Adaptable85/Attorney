# Staging Pre-Deploy Checklist

Status: Phase 5D planning
Date: 2026-06-23

This checklist must pass before any future staging deploy. It does not approve deployment by itself.

Phase 5D adds a resource creation runbook and approval checklist. Staging resource creation remains separate from staging deployment approval.

## GitHub Branch / PR Status

- Work is merged or approved through a reviewed PR.
- Local branch is clean.
- `main` is synced with `origin/main`.
- No unreviewed feature branches are used for staging.
- No secrets or real client data are present in Git.
- Staging resource creation approval is recorded before Vercel/Neon resources are created.

## Staging Resource Details

Manual staging resource details are pending concrete non-secret values.

- Vercel project name: pending.
- Vercel staging URL: pending.
- Neon project name: pending.
- Neon region: pending.
- Neon database/branch name: pending.
- `DATABASE_URL` configured in Vercel: pending yes/no confirmation, value must not be recorded.
- Write gates confirmed false/off: pending yes/no confirmation.
- `AUTH_PRODUCTION_READY=false`: pending yes/no confirmation.
- Production resources: not recorded as created.
- Production deploy: not run.

## Validation Commands

Run before staging deploy approval:

```sh
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run prisma:validate
pnpm run build
./scripts/check-agent-context.sh
./scripts/check-adr-needed.sh
./scripts/pre-pr-review.sh
```

If local PostgreSQL is available:

```sh
pnpm run test:db:local
```

## Database Migration Status

- Neon staging database exists only after explicit approval.
- `DATABASE_URL` points to staging only for staging deploy/migration work.
- Migration SQL has been reviewed.
- Staging migration command has been approved.
- Production migration is not run.
- `db:push` is not run.
- No real Burgess client data is loaded.

## Entra Staging App

- Entra staging app registration is not configured yet.
- Callback URL is not final until a Vercel staging URL exists.
- Allowed users/domains are not final.
- Role claim mapping is not final.
- MFA/break-glass process is not final.

## Auth / Write Gates

- `AUTH_PRODUCTION_READY=false`.
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false` until live-auth staging approval.
- `BURGESS_PRODUCTION_AUTH_ENABLED=false`.
- `BURGESS_PRODUCTION_AUTH_CONFIGURED=false`.
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED=false`.
- `BURGESS_AUDITED_PERSISTENCE_ENABLED=false` unless a later fake-data staging-write phase approves it.
- `BURGESS_PRODUCTION_WRITES_ENABLED=false`.
- UI saves remain disabled.

## Smoke Test Checklist

- `/` loads.
- `/admin` loads.
- `/admin/dashboard` loads.
- `/admin/clients` loads.
- `/admin/matters` loads.
- `/api/health` responds.
- Entra login/callback/logout routes remain disabled until approved.
- Create forms remain disabled.
- No real client data appears.
- No production write path is active.

## Rollback Plan

- Capture deployment reference before smoke testing.
- Use Vercel rollback for app regressions.
- Disable auth/write flags if unexpected behavior appears.
- Use Neon restore only after restore procedure is reviewed.
- Do not run rollback migrations without an approved recovery plan.

## Data Rules

- No production data.
- No real client data.
- Fake/test data must be clearly marked.
- Staging data may be reset unless a later phase defines retention requirements.
