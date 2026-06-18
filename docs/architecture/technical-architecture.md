# Technical Architecture

Status: Phase 0 foundation
Date: 2026-06-18

## Architecture Decision

The platform starts as a TypeScript Next.js App Router modular monolith.

This keeps the first build deployable and testable without introducing microservice coordination before the domain is proven.

## App / Backend Boundaries

The Next.js app will contain:

- App Router pages and route handlers.
- Server-side services.
- Domain modules.
- Validation schemas.
- Tests.
- Future database access through Prisma.

Product UI, API endpoints and database models are intentionally minimal in Phase 0.

## Service-Layer Rule

Business logic must live in server-side domain/service modules.

UI components and route handlers should call services; they should not own approval, financial, permission or audit logic directly.

Critical logic must be covered by tests before completion.

## Database / ORM Direction

Planned direction:

- PostgreSQL for production data.
- Prisma ORM for database access.

Phase 0 includes Prisma dependencies and a PostgreSQL datasource placeholder only. Real models and migrations belong in a later phase after the data model is accepted.

## Validation Approach

Planned direction:

- Zod for runtime validation at service/API boundaries.
- TypeScript for compile-time checks.
- Server-side permission validation for every sensitive action.

## Auth / Permission Strategy

Auth provider is not selected in Phase 0.

Permission strategy:

- Owner / Principal Attorney has full approval powers.
- Wesley / Build Support is restricted technical/support admin by default.
- OpenClaw Agent is draft-only service user by default.
- Sensitive permissions must be enforced server-side.

## Audit Strategy

Sensitive actions must produce audit records.

Critical future audit events:

- Login and failed login.
- Client file opened or changed.
- Document uploaded or accessed.
- Billing line item created/changed.
- Invoice approved/sent.
- Statement approved/sent.
- Payment imported or manually captured.
- Communication approved/sent.
- Agent action.
- Permission change.

## File Storage Placeholder

Client documents must be private by default.

Final storage choice is deferred. Future options may include private object storage or provider-managed secure storage.

No public file storage for client documents.

## Email Integration Placeholder

Email integration is deferred.

Future options may include Microsoft Graph/shared mailbox or SMTP depending on Burgess Attorneys setup.

Approved legal/status communications must be sent only after owner/principal approval.

## WhatsApp Integration Placeholder

WhatsApp integration is deferred.

Future options may include OpenClaw-managed WhatsApp session or WhatsApp Business API after reliability/compliance review.

Voice notes may create draft billing line items only.

## Lexpro Integration Placeholder

Lexpro import/sync is deferred.

Boundary:

- Burgess platform is source of truth for invoices and client-facing statement PDFs.
- Lexpro remains source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.

## Testing Strategy

Current tools:

- Vitest for unit/service tests.
- TypeScript typecheck.
- ESLint.
- Next build.

Future browser tests:

- Playwright can be added when real UI workflows exist.

Targets:

- 90%+ coverage overall when real business logic exists.
- 100% practical coverage for critical paths.

Critical paths:

- Auth.
- Permissions.
- Financial records.
- Approval gates.
- Document access.
- Data mutations.
- Agent actions.

## Deployment / Hosting Placeholder

Hosting is deferred.

Future decisions should consider:

- App hosting.
- PostgreSQL hosting.
- Private file storage.
- Environment/secrets management.
- Backups.
- Staging and production separation.

Hosting choice is ADR-worthy once the trade-off is real.

