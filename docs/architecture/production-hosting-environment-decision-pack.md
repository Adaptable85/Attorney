# Production Hosting And Environment Decision Pack

Status: Phase 5C staging setup planning
Date: 2026-06-23

PR #1 was squash merged into `origin/main` at `57dccc1 Review Burgess platform foundation auth (#1)`. Local `main` has been synced to that squash merge. No deployment has been run.

ADR 0009 accepts Vercel for the secure Next.js app/API and Neon managed PostgreSQL for the production database. xneelo remains a DNS/domain/public website option only unless the client explicitly requires xneelo Cloud/Managed Server infrastructure. xneelo shared hosting must not host the secure app.

Phase 5C adds staging setup planning and templates only. It creates no Vercel project, Neon database, live resource, provider secret or deployment. Staging setup remains pending explicit approval.

## A. Current App State

- Next.js App Router app exists.
- Prisma/PostgreSQL schema exists.
- Microsoft Entra ID / Microsoft 365 identity direction is accepted.
- Live Entra login is disabled.
- UI saves are disabled.
- Production writes are blocked.
- Local DB tests passed against `burgess_attorneys_dev`.
- No production deployment has occurred.
- No production database command has been run.
- Production Neon database has not been created or touched by this phase.
- Vercel project creation remains pending.
- Neon staging setup remains pending.
- Environment values remain placeholders only.

## B. Hosting Options

| Option | Strengths | Constraints / Risks |
| --- | --- | --- |
| Vercel + managed Postgres | Excellent Next.js compatibility, simple env vars, strong preview/staging story, fast rollback. | Managed Postgres provider must be chosen carefully; South African data/location comfort and cost need review; future document storage likely needs separate private object storage. |
| Railway | Good app + managed PostgreSQL ergonomics, simple env vars, logs and rollbacks. | Must review production maturity, backup controls, region/data expectations and support comfort for a legal/admin platform. |
| xneelo Cloud / managed server | Familiar South African provider, possible client comfort for domain/DNS and local business relationship. | Next.js app hosting, Node runtime operations, PostgreSQL management, backups, patching and rollback may require more manual ownership unless using a suitable managed product. |
| Render / Fly.io or similar managed app host | Managed deployments, env vars, logs, PostgreSQL options and rollback paths. | Region choice, backup features, cost and operational fit need confirmation; Next.js behavior must be tested in staging. |
| Self-managed VPS | Maximum control and potentially low base cost. | Highest operational burden: patching, hardening, monitoring, backups, database maintenance, TLS, incident response and rollback are owner responsibilities. |

Comparison criteria:

- Next.js compatibility.
- PostgreSQL support.
- Environment variable and secret management.
- Microsoft Entra redirect/callback setup.
- Backup and restore support.
- Logs and observability.
- Security controls and access management.
- Deployment rollback.
- South African business/legal comfort.
- Operating complexity.
- Cost.
- Future private document storage needs.

## C. Accepted Hosting Direction

Accepted direction: use Vercel for the secure Next.js app/API and Neon managed PostgreSQL for production and staging database environments.

If xneelo hosting is a client requirement, keep the public website, domain or DNS relationship on xneelo where appropriate, but host the secure admin app/API/database on Vercel + Neon unless the client explicitly requires xneelo Cloud/Managed Server infrastructure.

xneelo shared hosting must not host the secure admin app.

Avoid a self-managed VPS unless there is a strong operational reason and a named owner accepts patching, backup, monitoring, hardening and incident-response responsibility.

## D. Environment Separation

### Local

- App URL: `http://localhost:3000`.
- Database: local PostgreSQL `burgess_attorneys_dev`.
- Entra: disabled placeholders or fake/local test values only.
- Environment variables: `.env.local` only, not committed.
- Secrets storage: local developer machine only.
- Write gates: local/dev gates may be enabled only for fake `DEMO-*` tests.
- Production auth readiness: false.
- Migration policy: local reviewed migrations only.
- Backup policy: disposable local data; no real client data.

### Staging

- App URL: approved staging URL.
- Database: managed staging PostgreSQL.
- Approved provider direction: Neon staging database.
- Entra: separate staging app registration and staging redirect URI.
- Environment variables: platform secret manager.
- Secrets storage: managed platform secrets only.
- Write gates: disabled by default; staging writes require explicit approval and fake/test data only.
- Production auth readiness: false until staging validation is complete.
- Migration policy: reviewed migration applied to staging before production.
- Backup policy: automated backups plus restore test before production approval.

### Production

- App URL: approved production URL.
- Database: managed production PostgreSQL.
- Approved provider direction: Neon production database.
- Entra: production app registration and production redirect URI.
- Environment variables: platform secret manager.
- Secrets storage: managed platform secrets only with restricted access.
- Write gates: disabled until production auth, audit, transaction and release approval are complete.
- Production auth readiness: false until tenant/admin access, MFA, allowed users/domains, role claims and callback validation pass.
- Migration policy: reviewed migration only, after backup and staging success.
- Backup policy: automated backups, retention approval and scheduled restore testing.

## E. Required Environment Variables

Placeholders only:

- `DATABASE_URL`
- `AUTH_PROVIDER`
- `AUTH_ENTRA_TENANT_ID`
- `AUTH_ENTRA_CLIENT_ID`
- `AUTH_ENTRA_CLIENT_SECRET`
- `AUTH_ENTRA_REDIRECT_URI`
- `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS`
- `AUTH_ENTRA_ROLE_CLAIM`
- `AUTH_PRODUCTION_READY`
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED`
- `BURGESS_AUDITED_PERSISTENCE_ENABLED`
- `BURGESS_LOCAL_DEV_WRITES_ENABLED`
- `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED`
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED`
- `BURGESS_PRODUCTION_AUTH_PROVIDER`
- `BURGESS_PRODUCTION_AUTH_ENABLED`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED`
- `BURGESS_PRODUCTION_WRITES_ENABLED`
- `BURGESS_ALLOW_DEV_SEED`
- `BURGESS_ALLOW_DEV_DB_RESET`
- `BURGESS_DEV_CURRENT_ROLE`

Real values must be stored only in approved local, staging or production secret stores. No real secrets belong in Git.

## F. Production Safety Gates

- No production writes until production auth is validated.
- No UI saves until the release gate is explicitly enabled.
- No migrations without backup, SQL review and rollback review.
- No `db:push`.
- No production Neon database command until provisioning/migration is explicitly approved.
- No real client data in staging.
- No email or WhatsApp sends until separate approval.
- No invoice, statement, Lexpro sync or sending workflows until their phases are approved.

## G. Database Strategy

- Neon managed PostgreSQL is accepted as the production database direction.
- Automated backups are required.
- Restore testing is required before production go-live.
- Staging migration must run before production migration.
- Production migration command must be explicit and reviewed; local helper scripts are not production commands.
- `db:push` must not be used.
- Migration review checklist:
  - Confirm schema diff and SQL.
  - Confirm backup exists.
  - Confirm restore path.
  - Confirm staging success.
  - Confirm rollback or forward-fix plan.
  - Confirm no real data is copied into local/dev.

## H. Entra Strategy

- Create a staging Entra app registration.
- Create a separate production Entra app registration.
- Register exact callback URLs for staging and production.
- Enforce MFA according to Burgess policy.
- Confirm allowed users/domains.
- Define break-glass admin process.
- Define role claim mapping to Burgess role keys.
- Complete readiness checks before `AUTH_PRODUCTION_READY` or production auth flags can become true.

## I. Deployment Strategy

- Use PR review before deployment.
- Run CI checks before staging and production.
- Deploy to staging first.
- Run staging smoke tests for shell, disabled auth routes, disabled writes and health.
- Require production deploy approval.
- Keep rollback plan available before production deploy.
- Do not auto-deploy from unreviewed branches.
- Do not deploy as part of Phase 5A.
- Do not deploy as part of Phase 5C.
- Use `docs/architecture/staging-predeploy-checklist.md` before any future staging deploy approval.

## J. Decisions Needed

- Vercel project owner.
- Neon project owner.
- Staging URL.
- Production URL.
- Domain/DNS approach.
- Confirm xneelo remains DNS/public website only, unless xneelo Cloud/Managed Server is explicitly required by the client.
- Microsoft Entra tenant/admin access owner.
- Backup retention and restore-test cadence.
- Production deploy approvers.
- Production logging/monitoring owner.
- Future private document storage provider.

## K. Phase 5C Setup References

- Vercel staging checklist: `docs/architecture/vercel-staging-setup-checklist.md`.
- Neon staging checklist: `docs/architecture/neon-staging-setup-checklist.md`.
- Environment variable template: `docs/architecture/environment-variable-template.md`.
- Staging pre-deploy checklist: `docs/architecture/staging-predeploy-checklist.md`.
- Phase plan: `docs/plans/phase-5c-vercel-neon-staging-setup-plan.md`.
