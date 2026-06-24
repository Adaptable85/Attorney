# 0010: Use Vercel And Supabase Postgres For Secure App Hosting

Status: Superseded
Date: 2026-06-23

Supersedes: ADR 0009 database-provider decision.
Superseded by: ADR 0011 for the active staging hosting/database direction.

## Context

ADR 0009 accepted Vercel for the secure Next.js app/API and Neon managed PostgreSQL for the database. During Phase 5E, staging resource creation was blocked because Neon CLI authentication could not be completed in the execution window. The user then approved switching the managed PostgreSQL provider direction to Supabase.

Burgess Attorneys still needs a secure managed PostgreSQL setup for a Next.js legal-admin platform with Microsoft Entra auth, Prisma, audited writes and future private document storage.

The platform handles sensitive legal-admin data. Database hosting must support reviewed migrations, secret management, backup/restore checks, staging/production separation and fail-closed production readiness without requiring self-managed database operations by default.

## Decision

Use Vercel for the secure Next.js app/API and Supabase Postgres for staging and production PostgreSQL databases.

This direction is superseded by ADR 0011 for the active staging path, which now uses Railway and Railway Postgres. ADR 0010 remains as decision history unless Vercel + Supabase is later re-approved.

Use Supabase as a managed PostgreSQL provider only for now. Do not adopt Supabase Auth, Supabase Storage, Realtime, generated APIs or public object storage as part of this decision.

Keep Microsoft Entra ID / Microsoft 365 identity as the accepted production auth direction.

Keep xneelo only for DNS/domain/public website needs unless the client explicitly requires xneelo Cloud/Managed Server infrastructure. xneelo shared hosting must not host the secure admin app.

## Consequences

- Production deployment must still use Vercel environment variables and secret management.
- Staging and production databases must be separate Supabase projects/databases or otherwise isolated Supabase environments.
- Supabase connection strings must never be committed.
- Prisma migrations must be reviewed and run through approved migration commands only.
- Backup and restore checks are required before production write enablement.
- `db:push` must not be used.
- Supabase Auth must not replace Microsoft Entra unless a later ADR explicitly changes the auth provider decision.
- Supabase Storage must not be used for client documents unless a later file-storage ADR explicitly approves it.
- No production deploy, production database creation, secrets, live auth, UI saves or production writes are enabled by this decision.
