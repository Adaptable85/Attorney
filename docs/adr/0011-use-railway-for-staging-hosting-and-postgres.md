# 0011: Use Railway For Staging Hosting And Postgres

Status: Accepted
Date: 2026-06-24

Supersedes: ADR 0010 for the active staging hosting/database direction.

## Context

ADR 0010 accepted Vercel for the secure Next.js app/API and Supabase Postgres for managed PostgreSQL. During Phase 5H, the Vercel/GitHub/Supabase dashboard and authentication flow did not work smoothly for the user, and Supabase CLI authentication was not available to the execution environment.

The user prefers a deployment path similar to other projects already operated through Railway. Burgess Attorneys still needs a staging-only setup for a Next.js legal-admin platform with Microsoft Entra auth placeholders, Prisma, PostgreSQL, audited write gates and future private document storage decisions.

## Decision

Use Railway for staging app hosting and Railway Postgres for the staging database.

The Railway staging project should be named `burgess-attorneys-staging`. Railway should host the Next.js app service, and Railway Postgres should provide the staging `DATABASE_URL`.

The Vercel + Supabase direction becomes historical/superseded for this project unless later re-approved. Prior ADRs and checklists remain as decision history.

Railway Postgres is staging-only until production approval. This decision does not approve production deployment, production Railway resources, production databases or a custom production domain.

## Consequences

- No Railway resources are created by this ADR.
- No deployment is approved by this ADR.
- Railway staging resource creation requires a later approved setup phase.
- Railway Postgres `DATABASE_URL` must be stored only in approved Railway variables or secure local shell context when explicitly needed.
- Prisma staging migrations must use reviewed migration commands such as `pnpm exec prisma migrate deploy`.
- `db:push` remains forbidden.
- Production migrations remain forbidden unless separately reviewed and approved.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No WhatsApp, email, invoice, statement or Lexpro workflow is approved by this ADR.
- No secrets are committed to Git.
