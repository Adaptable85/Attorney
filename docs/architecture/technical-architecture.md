# Technical Architecture

Status: Phase 3B local Prisma repository adapter foundation
Date: 2026-06-23

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

Product UI and feature API endpoints remain intentionally minimal. Phase 2A adds a protected admin shell with role-aware placeholder navigation only.

## Service-Layer Rule

Business logic must live in server-side domain/service modules.

UI components and route handlers should call services; they should not own approval, financial, permission or audit logic directly.

Critical logic must be covered by tests before completion.

## Database / ORM Direction

Planned direction:

- PostgreSQL for production data.
- Prisma ORM for database access.

Phase 1A includes Prisma foundation models for users, roles, permissions, audit logs and agent actions.

Phase 1B adds client, contact, matter, assignment, note, document metadata and timeline models.

Phase 1C adds billing line item, invoice, invoice approval, invoice number sequence, statement snapshot, statement approval and financial correction models.

Payment/import, Lexpro, marketing and outreach models are deferred.

Financial records store money in integer cents with currency fields. Floating point money fields are not allowed.

Migrations are controlled and reviewed. Local dev migrations may be created only when explicitly instructed. Production migrations must not be run automatically by agents.

Prisma 7 keeps the datasource URL in `prisma.config.ts`, not in `schema.prisma`. The current config uses `DATABASE_URL` when present and a local placeholder URL for deterministic validation only.

## Validation Approach

Planned direction:

- Zod for runtime validation at service/API boundaries.
- TypeScript for compile-time checks.
- Server-side permission validation for every sensitive action.

## Auth / Permission Strategy

Auth provider is not selected in Phase 1A.

Phase 1A adds a provider-neutral auth interface and local/dev placeholder boundary. It does not claim production security.

Phase 2A uses that boundary to protect the `/admin` shell. Local development may use an explicit placeholder principal. Production auth remains unresolved and must be selected before real protected workflows are exposed.

Phase 2B reuses the same boundary for `/admin/dashboard`. The dashboard is read-only and backed by demo placeholder data only.

Phase 2C adds server-side client/matter service functions that wrap repository interfaces with admin access checks, create permissions and safe typed errors. No API route handlers are exposed in Phase 2C, and normal validation remains database-free.

Phase 2D adds protected read-only client and matter pages. These pages use safe demo repositories through the Phase 2C service functions and display placeholder operational fields only. They do not expose edit, delete, send, approval, upload, download, payment reconciliation or Lexpro sync controls.

Phase 2E adds disabled client/matter create form foundations. They are permission-gated for owner/principal and support admin users, but no server action, API route or persistence wiring exists.

Phase 3A hardens the auth boundary for future production auth. Authenticated sessions are mapped through explicit role keys into domain principals, and unknown roles fail closed. The local/dev current user helper remains disabled in production and no production secrets are required for normal tests.

Phase 3A also adds audited service context for future writes. Mutation-capable services must receive actor, role, source and audit writer context, pass permission checks and provide audit metadata before mutation preparation runs.

Phase 3B adds local-only Prisma repository adapters for clients and matters. These adapters prove fake client/matter create, read, list and matter update behavior against the existing schema through DB-specific tests, but they do not enable live UI saves, API mutation routes or production database operations. Normal validation remains database-free.

Permission strategy:

- Owner / Principal Attorney has full approval powers.
- Wesley / Build Support is restricted technical/support admin by default.
- OpenClaw Agent is draft-only service user by default.
- Sensitive permissions must be enforced server-side.
- Future delegated overrides must be explicit and tested.
- Agents may not create or edit client or matter records directly.
- Agents may create draft suggestions only and may not approve, assign invoice numbers, override VAT treatment or create final financial corrections.
- Agent service users do not receive normal admin shell navigation by default.

## Admin Shell

Phase 2A adds `/admin` as a protected internal shell.

The shell includes placeholder cards for:

- Active Matters.
- Pending Invoice Approvals.
- Pending Statement Approvals.
- Document Review.
- Audit Log.
- Agent Drafts.
- Lexpro Boundary / Accounting Sync Placeholder.
- Website / Marketing Placeholder.

Every module card is labelled `Not implemented yet` and `Coming in later phase`.

The shell does not display real client, matter, document or financial data. It does not include CRUD, approval, send, publish, upload, download, Lexpro sync or payment reconciliation actions.

Phase 2B adds `/admin/dashboard` as a protected read-only overview. Dashboard sections are role-filtered and clearly labelled as demo placeholder data. Owner/principal users can see pending approval placeholders, while support admins see preparation placeholders without owner-only controls. The dashboard does not expose create, edit, delete, approve, send, publish, upload, download, Lexpro sync or payment reconciliation actions.

## Audit Strategy

Sensitive actions must produce audit records.

Phase 1A adds:

- Audit event type definitions.
- Audit event creation.
- Injected audit writer boundary.
- AuditLog Prisma model.

Phase 3A adds an audited mutation executor for service-layer write preparation. It records audit intent before running mutation preparation so future live writes cannot bypass audit context. Real database-backed writes should later use transactions or an outbox pattern when available.

Phase 3B intentionally leaves audit writes and client/matter writes non-atomic in production terms. Before live saves are enabled, the implementation needs a production auth provider plus a reviewed transaction or outbox design.

Phase 1B extends audit event categories for:

- Client created/edited.
- Matter created/edited.
- Matter note added.
- Document metadata created/uploaded/downloaded/accessed.
- Timeline event created.

Phase 1C extends audit event categories for billing line items, invoice submission/approval/numbering/correction, statement snapshots/approval/correction, financial corrections and VAT overrides.

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

Phase 1B stores document metadata only. No raw file content is stored in `DocumentRecord`.

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

## Repository Boundary

Phase 1D defines repository interfaces.

Phase 1E adds a minimal Prisma-backed users/roles repository adapter to prove the local database path. Invoice, statement, billing, client and matter persistence implementations remain deferred.

The interfaces protect future persistence work by:

- Avoiding hard-delete methods for protected records.
- Separating draft updates from approved financial correction workflows.
- Keeping audit writing explicit.
- Keeping document records metadata-only.

Concrete Prisma implementations outside the users/roles spike are deferred until their phases are accepted.

Phase 2C adds service boundaries for listing, reading and creating client/matter records through repository interfaces. These services are designed for future route handlers and server actions, but they do not expose delete operations or require a production database.

Phase 2D adds read-only UI pages for client and matter summaries. The current data source is clearly labelled demo data and is not a live database read model.

Phase 2E form pages are future-phase placeholders only. Enabling them will require server-side validation, service calls, audit logging and persistence tests.

Phase 3A updates client/matter create service functions to require audited service context. The UI forms remain disabled; no API route, server action or live save is exposed.

## Seed Strategy

Phase 1D includes deterministic fake fixtures.

Phase 1E wires a guarded dev seed for fake users and roles only.

Seed data must not contain real client data and must never run automatically in production.
