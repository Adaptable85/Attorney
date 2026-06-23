# Technical Architecture

Status: Phase 5A production hosting/environment decision pack
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

Phase 3C adds an audited transaction boundary for future live writes. Audited mutations now require actor context, a permission decision, audit metadata and a transaction boundary before audit recording and repository mutation run. The default boundary is immediate for normal tests; Prisma transaction behavior is isolated to guarded local DB tests. UI saves remain disabled.

Phase 3D adds a local/dev service composition layer that wires Prisma client, matter, audit and transaction adapters together for backend-only testing. It is disabled in production, not imported by app UI routes and does not expose server actions or API mutation routes.

Phase 3E adds production auth design documentation, server-action/API mutation entrypoint design, default-off client/matter write release gates and a service-layer mutation gate helper. The helper requires a production-compatible principal, service context, permission action, audit metadata, transaction boundary and enabled release gate before future mutation entrypoints may call service mutation code. No server action, API route, live UI save, production auth provider or production database command is added.

Phase 3F adds a provider-neutral production auth adapter boundary and auth readiness helpers. Production auth readiness defaults false, local/dev auth does not count as production readiness and unknown providers fail closed. The provider choice remains pending and no secrets are added.

Phase 3F also adds disabled server-module skeletons for future client/matter create entrypoints. They evaluate the mutation gate but still return disabled typed errors and do not call repositories, Prisma adapters, server actions or API routes.

Phase 3G adds dev-only server-module mutation functions for client and matter creation. They require explicit local/dev release gates, local/dev service composition, mutation gate success, audit metadata, transaction boundary and fake `DEMO-*` account numbers. They use the audited client/matter service functions and remain unwired from UI forms or API routes.

Phase 3H adds safe local DB validation documentation, local helper scripts and a dev/staging readiness checklist. It adds no schema changes, routes, UI saves or production writes.

Phase 3J adds a production auth provider decision pack. Phase 3K.1 records Microsoft Entra ID / Microsoft 365 identity as the accepted production auth provider direction. This adds no provider integration, secrets, routes, UI saves, production auth readiness or production writes.

Phase 4A adds a Microsoft Entra auth skeleton under `src/auth/entra`. The skeleton includes config parsing, issuer metadata URL helpers, Entra-like claim mapping and an adapter boundary that fails closed when config or production readiness is missing. It does not perform live OAuth, create sessions, add callback routes, commit secrets, enable production auth readiness or enable writes.

Phase 4B adds disabled Entra login, callback and logout route placeholders plus future session shape validation. The placeholders return disabled JSON only and do not redirect to Microsoft, exchange tokens, create session cookies, enable production auth readiness or enable writes.

Phase 4C adds OAuth state/nonce helpers, PKCE helpers, an Entra JWKS descriptor and a token-validation skeleton. Complete placeholder tokens still fail with cryptographic verification required, and no Microsoft network calls, redirects, token exchanges, session cookies, production auth readiness or writes are enabled.

Phase 4D adds an OAuth state store boundary with an in-memory test adapter and a JWKS metadata cache boundary with an injectable fetcher. These boundaries are not wired to live routes, cookies, sessions or default Microsoft network fetches. Token validation still fails until real cryptographic verification exists.

Phase 4E adds disabled-by-default staging wiring that composes Entra config, OAuth state storage, JWKS cache, PKCE helpers and token-validation dependency markers. It returns a non-live dependency bundle only when the explicit staging flag, complete placeholder config and a crypto verification dependency marker are present. Routes remain disabled and no production auth readiness or production writes are enabled.

Phase 4F adds JWKS key-selection and JWT verifier boundaries. The verifier has no default implementation and no JWT library was added. Tests use fake/local keys and an injected local verifier only to prove the boundary; live routes remain disabled and no production auth readiness or writes are enabled.

Phase 4G selects `jose` in ADR 0008 and adds a non-live adapter skeleton that verifies fake/local RS256 tokens with injected JWK material only. It does not fetch Microsoft JWKS metadata, wire routes, create sessions, enable production auth readiness or enable writes.

Phase 4H adds staging callback/JWKS fetch-cache design documentation. It does not enable route behavior, Microsoft redirects, token exchange, default Microsoft network fetches, session cookies, production auth readiness or writes.

PR #1 was squash merged into `origin/main` at `57dccc1 Review Burgess platform foundation auth (#1)`, and local `main` has been synced to that squash merge.

Phase 5A adds a production hosting/environment decision pack. It recommends a managed app host plus managed PostgreSQL, with xneelo retained for public website/domain/DNS if required. It does not deploy, run production database commands, run production migrations, configure real secrets, enable live Entra auth, enable UI saves or enable production writes.

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

Phase 3C resolves the immediate transaction decision in ADR 0006. AuditLog is the internal outbox-equivalent for now, and audit recording plus repository mutation must run inside an injected transaction boundary before live persistence is exposed. A separate outbox table remains deferred until external event dispatch exists.

Phase 3D adds a Prisma AuditLog repository adapter and audit-writer bridge for local/dev composition. DB-specific tests remain optional and guarded to local `burgess_attorneys_dev`.

Phase 3E keeps live writes blocked by release gates. Audit context and transaction dependency are required by the mutation gate before future entrypoints can proceed, but no active entrypoint exists in this phase.

Phase 3F keeps the new client/matter mutation skeletons non-writing. Audit metadata and transaction boundary dependencies are validated before the skeleton returns disabled, so future wiring has a tested fail-closed path.

Phase 3G permits local/dev backend writes only through explicit dev gates and audited transaction composition. Production writes remain blocked by production auth readiness and `productionWritesEnabled`.

Phase 3H local DB validation could not run in this execution environment because local PostgreSQL CLI/server tooling is unavailable. DB-only tests remain guarded and optional.

Phase 4F does not change persistence. Production writes remain blocked until live Entra implementation, tenant/admin access, MFA policy, role mapping, staging validation, cryptographic token verification, audit/transaction review and release gates are complete.

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

Phase 3C adds transaction-boundary injection to client/matter create service preparation. This is still service-layer-only; no API route, server action or UI save is exposed.

Phase 3D composes those repositories for local/dev backend tests only. Production auth and release approval still block live persistence.

Phase 3E adds a mutation entrypoint gate for future route handlers or server actions. App UI routes must not import the gate directly, and the disabled create forms remain non-submitting placeholders until production auth, audited transaction wiring and release approval are accepted.

Phase 3G keeps create forms disabled. The dev-only mutation functions are backend test paths only and must not be imported by UI routes until a separate UI-write phase is accepted.

## Seed Strategy

Phase 1D includes deterministic fake fixtures.

Phase 1E wires a guarded dev seed for fake users and roles only.

Seed data must not contain real client data and must never run automatically in production.
