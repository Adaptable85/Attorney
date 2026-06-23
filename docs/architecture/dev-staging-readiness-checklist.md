# Dev/Staging Readiness Checklist

Status: Phase 5A checklist
Date: 2026-06-23

PR #1 has been squash merged to `origin/main` at `57dccc1`, and local `main` has been synced to that squash merge. Deployment remains blocked until hosting, production database, DNS, backup and deployment approvals are accepted.

## Local DB Readiness

- Confirm PostgreSQL is local and reachable.
- Confirm `DATABASE_URL` points to `postgresql://adaptable@localhost:5432/burgess_attorneys_dev` or another clearly local Attorney dev database accepted by the DB guard.
- Refuse Railway, Supabase, Neon, Render, Vercel, remote hostnames and production URLs.
- Confirm no real Burgess client data exists in the local database.

## Migration Status

- Run `pnpm run prisma:validate`.
- Run `DATABASE_URL="postgresql://adaptable@localhost:5432/burgess_attorneys_dev" pnpm exec prisma migrate status`.
- Use `pnpm run db:migrate:local` only for reviewed local migrations.
- Never run `db:push`.
- Never run production migrations automatically.

## DB Test Status

- Run `DATABASE_URL="postgresql://adaptable@localhost:5432/burgess_attorneys_dev" pnpm run test:db` only after the local DB guard accepts the URL.
- Confirm dev-only client/matter writes require explicit local/dev gates.
- Confirm audit logs are written.
- Confirm transaction rollback tests pass.
- Confirm agent and read-only users are blocked.
- Confirm disabled gates prevent writes.

## Environment Variables

- `DATABASE_URL` for local DB tests only.
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED=true` for explicit dev/staging write testing.
- `BURGESS_LOCAL_DEV_WRITES_ENABLED=true` for local/dev write testing.
- `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=true` for dev-only mutation entrypoints.
- `BURGESS_AUDITED_PERSISTENCE_ENABLED=true` for audited persistence tests.
- `BURGESS_PRODUCTION_AUTH_CONFIGURED` and `BURGESS_PRODUCTION_WRITES_ENABLED` remain false until production release approval.

## Feature And Release Gates

- All write flags default off.
- Local/dev writes require explicit local/dev flags and fake `DEMO-*` account numbers.
- Production writes require production auth readiness plus explicit production write enablement.
- UI saves stay disabled until a separate release phase approves them.

## Security Review

- Verify no secrets are committed.
- Verify no real client data is used in fixtures, seed data or tests.
- Verify sensitive actions are audit logged.
- Verify no hard-delete path exists for protected records.
- Verify owner/principal approval gates remain required for invoices, statements and sending.

## Data Protection / POPIA

- Treat client, matter, document, communication and financial records as sensitive.
- Keep documents private by default.
- Use fake `DEMO-*` records only in local/dev tests.
- Do not copy production data into local/dev environments.

## Rollback Checklist

- Disable local/dev write flags.
- Archive or reset fake local test records as needed.
- Review audit logs for attempted mutations.
- Re-run normal validation.
- Keep UI saves disabled until release approval is recorded.

## Production Write Blockers

- Approved direction: Microsoft Entra ID / Microsoft 365 identity.
- Confirm Burgess Microsoft 365 tenant/admin access before implementation.
- Confirm MFA availability/enforcement, allowed users/domains, role claim approach and break-glass admin process before implementation.
- Confirm hosting provider, production DB provider, staging URL, production URL, domain/DNS approach, backup retention and production deploy approvers before deployment.
- Production release approval remains pending.
- Production backup/rollback plan remains pending.
- Owner/principal approval workflow review remains pending.
- No production writes until all blockers are resolved and approved.

## Phase 5A Hosting / Environment Checklist

- Review `docs/architecture/production-hosting-environment-decision-pack.md`.
- Choose managed app host and managed PostgreSQL provider.
- Decide whether xneelo remains public website/domain/DNS only.
- Create staging before production.
- Configure environment variables only through approved secret stores.
- Keep production auth readiness false until Entra staging and production checks pass.
- Keep UI saves and production writes disabled until later release approval.
- Do not deploy from unreviewed branches.
