# Neon Staging Setup Checklist

Status: Phase 5D planning
Date: 2026-06-23

This checklist prepares Neon staging setup only. It does not create a Neon project, create a production database, run production database commands, run production migrations or add secrets.

Phase 5D adds `docs/architecture/staging-resource-creation-runbook.md` and `docs/architecture/staging-resource-approval-checklist.md`. Complete the approval checklist before creating any Neon project, branch or database.

## Project Recommendation

- Recommended Neon project name: `burgess-attorneys-admin`.
- Use separate staging and production database environments.
- Restrict project access to approved maintainers.
- Store connection strings only in approved secret stores.
- Confirm resource creation approval before creating the project.

## Region Choice Decision

- Choose a region close to the Vercel function region where practical.
- Balance latency, reliability, provider support and client comfort.
- Record the selected staging and production regions before any deploy.
- Revisit region choice before production if legal/business requirements change.

## Staging Database

- Recommended staging database name: `burgess_attorneys_staging`.
- Use fake/test data only.
- Do not copy real Burgess client data into staging.
- Use a separate application role for runtime access.
- Use a separate migration role if operationally supported.
- Confirm connection URL is stored only in Vercel staging secrets.

## Future Production Database

- Recommended production database name: `burgess_attorneys_production`.
- Create only after explicit production database approval.
- Do not use production connection strings locally or in preview deployments.
- Confirm backup retention before production writes.
- Confirm restore test before production write enablement.

## Connection Pooling

- Use Neon pooled connection string for serverless/runtime traffic if recommended by Neon for Vercel deployments.
- Use direct connection string only for reviewed migration commands if required by Prisma/Neon guidance.
- Document which URL type is used for runtime and which is used for migrations before staging deploy.

## Backup / Restore Checklist

- Confirm automated backups are enabled.
- Confirm retention period.
- Confirm restore procedure.
- Run and document a restore test before production writes.
- Confirm who can approve restore operations.

## Migration Policy

- Never use `db:push`.
- Review generated Prisma migration SQL before staging.
- Apply migrations to staging before production.
- Record migration command, result and rollback/forward-fix plan.
- Production migrations require explicit approval, backup confirmation and staging success.

## Staging Migration Command

Expected staging command, using the staging `DATABASE_URL` from the approved secret store:

```sh
pnpm run prisma:validate
pnpm exec prisma migrate deploy
```

Do not run this command until a staging database exists and migration approval is explicit.

## Production Migration Approval Checklist

- Production Neon database exists and has approved access controls.
- Production backup is confirmed.
- Restore procedure is tested or explicitly accepted as pending.
- Staging migration has succeeded.
- Staging smoke tests have passed.
- Migration SQL has been reviewed.
- Rollback or forward-fix plan is documented.
- Owner/principal or named production approver approves the migration.

## Restore-Test Requirement

Production writes must remain blocked until a restore test is completed or a named approver explicitly accepts the residual risk.
