# Vercel And Neon Implementation Checklist

Status: Phase 5D checklist
Date: 2026-06-23

ADR 0009 accepts Vercel for the secure Next.js app/API and Neon managed PostgreSQL for production database hosting. This checklist is implementation planning only. It does not deploy, create production databases, add secrets, enable live auth, enable UI saves or enable production writes.

Phase 5C adds dedicated staging setup references:

- `docs/architecture/vercel-staging-setup-checklist.md`
- `docs/architecture/neon-staging-setup-checklist.md`
- `docs/architecture/environment-variable-template.md`
- `docs/architecture/staging-predeploy-checklist.md`

No Vercel project, Neon database, live resource, provider secret or deployment has been created by Phase 5C.

Phase 5D adds the staging resource creation runbook and approval checklist:

- `docs/architecture/staging-resource-creation-runbook.md`
- `docs/architecture/staging-resource-approval-checklist.md`

Resource creation still requires explicit approval. No Vercel project, Neon database, provider secret or deployment is created by Phase 5D.

## Vercel Project Setup

- Create a Vercel project for the secure admin app.
- Connect the reviewed repository.
- Disable automatic production deploys from unreviewed branches if possible.
- Configure preview/staging branch behavior.
- Confirm Next.js build command and output are detected.
- Confirm Node.js/runtime settings.
- Restrict project access to approved maintainers.
- Use the Phase 5C Vercel staging checklist before creating staging resources.
- Use the Phase 5D approval checklist before creating staging resources.

## Neon Project Setup

- Create Neon workspace/project for Burgess production data after approval.
- Create a separate staging database or project.
- Create a separate production database.
- Confirm role/user permissions for app runtime and migration operations.
- Keep credentials in approved secret stores only.
- Do not commit Neon URLs or credentials.
- Use the Phase 5C Neon staging checklist before creating staging resources.
- Use the Phase 5D runbook before creating staging resources.

## Region Decision

- Choose Vercel region(s) and Neon region with latency, reliability and legal/business comfort in mind.
- Keep app functions and database region reasonably close.
- Document the chosen regions before staging deploy.
- Revisit the region decision before production go-live if client/legal requirements change.

## Environment Variables

Configure placeholders first, then real values only in Vercel/Neon secret stores:

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
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED`
- `BURGESS_PRODUCTION_AUTH_PROVIDER`
- `BURGESS_PRODUCTION_AUTH_ENABLED`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED`
- `BURGESS_PRODUCTION_WRITES_ENABLED`

Production defaults must remain fail-closed until approved:

- `AUTH_PRODUCTION_READY=false`
- `BURGESS_PRODUCTION_AUTH_ENABLED=false`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED=false`
- `BURGESS_PRODUCTION_WRITES_ENABLED=false`

## Entra Callback URLs

- Create staging Entra app registration.
- Create production Entra app registration.
- Register exact Vercel staging callback URL.
- Register exact production callback URL.
- Confirm allowed domains/users.
- Confirm role claim mapping.
- Confirm MFA and break-glass process.
- Keep live login disabled until callback/session implementation is approved and validated.

## Migration Policy

- Run `pnpm run prisma:validate` before migrations.
- Review Prisma migration SQL before staging.
- Apply migration to staging first.
- Confirm staging smoke tests pass.
- Take/confirm production backup before production migration.
- Run production migration only with explicit approval.
- Never use `db:push`.

## Backup / Restore Policy

- Enable Neon automated backups for staging and production as appropriate.
- Approve production backup retention.
- Run and document a restore test before production write enablement.
- Define who can restore and who approves restore operations.
- Keep local/dev data fake and separate from production.

## Smoke Tests

- App root loads.
- `/admin` shell loads.
- `/admin/dashboard`, `/admin/clients` and `/admin/matters` load.
- Entra route placeholders remain disabled until live-auth phase.
- Client/matter create forms remain disabled.
- Production write gates remain off.
- Health route responds.
- No real client data appears in staging.

## Rollback Plan

- Use Vercel deployment rollback for app regressions.
- Keep prior deployment reference available before production deploy.
- Keep Neon backup/restore procedure documented.
- Disable production auth/write flags if unexpected behavior appears.
- Do not run rollback migrations without reviewed recovery plan.

## Production Deploy Approval Checklist

- Hosting provider accepted: Vercel.
- Database provider accepted: Neon.
- Staging URL approved.
- Production URL approved.
- DNS/domain approach approved.
- Entra tenant/admin access confirmed.
- Entra staging and production app registrations confirmed.
- Backup retention approved.
- Restore test completed.
- Owner/principal or named approver approves production deploy.
- Production writes remain blocked unless a later release phase explicitly approves them.
