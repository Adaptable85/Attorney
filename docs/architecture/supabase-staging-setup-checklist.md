# Supabase Staging Setup Checklist

Status: Historical / superseded by ADR 0011
Date: 2026-06-23

ADR 0010 accepted Supabase Postgres as the managed PostgreSQL direction replacing Neon. ADR 0011 supersedes the active staging direction with Railway + Railway Postgres. This checklist is retained as historical context only. Use `docs/architecture/railway-staging-setup-checklist.md` for active staging planning.

## Project Recommendation

- Recommended Supabase project name: `burgess-attorneys-staging`.
- Use Supabase Postgres only.
- Do not enable Supabase Auth for the Burgess admin app.
- Do not use Supabase Storage for client documents.
- Restrict project access to approved maintainers.
- Store connection strings only in approved secret stores.

## Region Choice Decision

- Choose a region close to the Vercel function region where practical.
- Balance latency, reliability, provider support and client comfort.
- Record the selected staging and production regions before any deploy.
- Revisit region choice before production if legal/business requirements change.

## Staging Database

- Recommended staging database/project name: `burgess-attorneys-staging`.
- Use fake/test data only.
- Do not copy real Burgess client data into staging.
- Confirm connection URL is stored only in Vercel staging/preview secrets.
- Confirm pooling/direct connection guidance before migrations.

## Future Production Database

- Recommended production database/project name: `burgess-attorneys-production`.
- Create only after explicit production database approval.
- Do not use production connection strings locally or in preview deployments.
- Confirm backup retention before production writes.
- Confirm restore test before production write enablement.

## Migration Policy

- Never use `db:push`.
- Review generated Prisma migration SQL before staging.
- Apply migrations to staging before production.
- Record migration command, result and rollback/forward-fix plan.
- Production migrations require explicit approval, backup confirmation and staging success.

Expected staging command, using the staging `DATABASE_URL` from the approved secret store:

```sh
pnpm run prisma:validate
pnpm exec prisma migrate deploy
```

Do not run this command until a staging database exists and migration approval is explicit.

## Backup / Restore Checklist

- Confirm automated backup capability and retention for the selected Supabase plan.
- Confirm restore procedure.
- Run and document a restore test before production writes.
- Confirm who can approve restore operations.

## Explicit Non-Scope

- No Supabase Auth.
- No Supabase Storage.
- No generated/public APIs.
- No public client document storage.
- No production database creation.
- No production deploy.
