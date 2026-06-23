# 0009: Use Vercel And Neon For Secure App Hosting

Status: Accepted
Date: 2026-06-23

## Context

Burgess Attorneys needs a secure managed production setup for a Next.js legal-admin platform with Microsoft Entra auth, Prisma, PostgreSQL, audited writes and future private document storage.

The platform handles sensitive legal-admin data. Hosting must support reviewed deployments, secret management, managed PostgreSQL, rollback, backups and staged production-readiness checks without making the build team responsible for self-managed server patching and database operations by default.

## Decision

Use Vercel for the secure Next.js app/API and Neon managed PostgreSQL for the production database.

Keep xneelo only for DNS/domain/public website needs unless the client explicitly requires xneelo Cloud/Managed Server infrastructure.

xneelo shared hosting must not host the secure admin app.

## Consequences

- Production deployment must use Vercel environment variables and secret management.
- Staging and production databases must be separate Neon databases/projects or otherwise isolated Neon environments.
- Region selection must keep Vercel functions and Neon database placement reasonably close.
- Migrations must be reviewed and run through approved migration commands only.
- Backup and restore checks are required before production write enablement.
- `db:push` must not be used.
- xneelo shared hosting is limited to DNS/domain/public website use and must not host the secure app.
- This ADR does not deploy the app, create production databases, add secrets, enable live auth, enable UI saves or enable production writes.
