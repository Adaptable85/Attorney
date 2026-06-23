# Phase 5A Plan: Production Hosting And Environment Decision Pack

Status: Phase 5A planning only
Date: 2026-06-23

## Summary

Phase 5A prepares the production hosting, database and environment decision pack after PR #1 was squash merged into `origin/main` at `57dccc1 Review Burgess platform foundation auth (#1)`.

Local `main` has been synced to the squash merge commit. No deployment is part of this phase.

## Scope

- Document hosting and environment options for the secure Burgess Attorneys admin app.
- Compare app hosting, managed PostgreSQL and operational trade-offs.
- Define local, staging and production environment separation.
- List required environment variables as placeholders only.
- Document production safety gates, migration policy, backup expectations and rollback requirements.
- Record decisions still needed before deployment.
- Keep production auth, UI saves and production writes disabled.

## Non-Goals

- No deployment.
- No production database provisioning.
- No production migration.
- No `db:push`.
- No real Microsoft Entra secrets.
- No live Entra login.
- No UI save enablement.
- No production writes.
- No invoice, statement, email, WhatsApp or Lexpro implementation.

## Assumptions

- The app remains a Next.js App Router modular monolith.
- PostgreSQL remains the production data direction.
- Prisma remains the ORM direction.
- Microsoft Entra ID / Microsoft 365 identity remains the accepted production auth direction.
- Local DB validation passed against `burgess_attorneys_dev`.
- Production hosting, production database, DNS and backup decisions still require human/client approval.

## Risks

- Legal/admin data requires strong operational discipline around backups, access control, logs and incident response.
- A self-managed VPS increases patching, backup, monitoring and security burden.
- Hosting choice affects Entra callback URLs, environment variable management, rollback paths and future document storage.
- Production writes must stay blocked until auth, audit, transaction and release-gate readiness are reviewed.

## Implementation Steps

1. Sync local `main` to `origin/main` after the PR #1 squash merge.
2. Create the hosting/environment architecture decision pack.
3. Update architecture/context files with Phase 5A status.
4. Run deterministic validation.
5. Run guarded DB tests only if local PostgreSQL remains available.
6. Commit the documentation-only decision pack.

## Validation

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

## Rollback / Recovery

- Revert only this documentation commit if the decision pack needs replacement.
- Keep production deploys blocked until an approved hosting/environment decision exists.
- Keep production write gates disabled.
- Do not run production migrations as part of rollback.

## Acceptance Criteria

- Local `main` points at `57dccc1`.
- `docs/architecture/production-hosting-environment-decision-pack.md` exists.
- Phase 5A context updates record that deployment remains blocked.
- Required validation passes.
- No secrets, production writes, live auth, UI saves or deployment are introduced.

## Open Questions

- Which hosting provider should be approved?
- Which managed PostgreSQL provider should be approved?
- What are the staging and production URLs?
- Will xneelo remain only DNS/public website hosting, or must it host the secure app too?
- Who approves production deploys?
- What backup retention and restore-test cadence is required?
- Who owns Microsoft Entra tenant/admin setup and role claim mapping?
