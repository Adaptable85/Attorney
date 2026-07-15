# Architecture Index

Phase 0 architecture foundation is implemented.
Phase 1A auth, role, permission, audit and persistence boundaries are implemented.
Phase 1B client, matter, document metadata and timeline persistence foundations are implemented.
Phase 1C billing, invoice, statement and financial correction foundations are implemented.
Phase 1D migration strategy, repository interfaces, Prisma boundary and fake seed fixtures are implemented.
Phase 1E local migration execution, Prisma Client generation and a minimal users/roles repository adapter are implemented.
Phase 2A protected admin shell UI and role-aware placeholder navigation are implemented.
Phase 2B read-only admin dashboard overview with safe demo placeholder data is implemented.
Phase 2C client/matter service boundaries are implemented without API routes or database-dependent normal tests.
Phase 2D read-only client/matter UI is implemented with safe demo data through service boundaries.
Phase 2E disabled client/matter create form foundations are implemented without persistence.
Phase 3A auth/session hardening and audited persistence enablement are implemented without live UI saves.
Phase 3B local-only Prisma client/matter repository adapters and guarded DB integration tests are implemented without live UI saves or production database operations.
Phase 3C audited transaction boundary is implemented without live UI saves or production database operations.
Phase 3D local/dev client-matter service composition is implemented without live UI saves or production database operations.
Phase 3E production-auth gating and server-action/API mutation design is implemented without live write entrypoints.
Phase 3F production-auth adapter boundary and disabled mutation entrypoint skeletons are implemented without live write entrypoints.
Phase 3G dev-only client/matter write path is implemented for backend tests without production writes or UI saves.
Phase 3H safe local DB validation documentation and dev/staging readiness checklist are implemented without production writes or UI saves.
Phase 3J production auth provider decision pack is implemented without provider integration, production secrets, production writes or UI saves.
Phase 3K.1 Microsoft Entra ID / Microsoft 365 identity decision ADR is accepted without provider integration, production secrets, production auth readiness, production writes or UI saves.
Phase 4A Microsoft Entra auth skeleton is implemented without live OAuth, session creation, real secrets, production auth readiness, production writes or UI saves.
Phase 4B Entra staging setup, callback/session design and disabled route placeholders are implemented without Microsoft redirects, token exchange, session cookies, production auth readiness, production writes or UI saves.
Phase 4C Entra OAuth state/nonce, PKCE, JWKS descriptor and token-validation skeletons are implemented without Microsoft redirects, token exchange, JWKS network fetch, cryptographic token acceptance, session cookies, production auth readiness, production writes or UI saves.
Phase 4D Entra OAuth state storage and JWKS metadata cache boundaries are implemented without Microsoft redirects, token exchange, default JWKS network fetch, cryptographic token acceptance, session cookies, production auth readiness, production writes or UI saves.
Phase 4E disabled-by-default Entra staging dependency wiring is implemented without route enablement, Microsoft redirects, token exchange, default JWKS network fetch, cryptographic token acceptance, session cookies, production auth readiness, production writes or UI saves.
Phase 4F Entra JWT/JWKS verification boundary skeleton is implemented without route enablement, Microsoft redirects, token exchange, default JWKS network fetch, session cookies, production auth readiness, production writes or UI saves.
Phase 4G selects `jose` for Entra JWT/JWKS verification and adds a non-live adapter skeleton without route enablement, Microsoft redirects, token exchange, default JWKS network fetch, session cookies, production auth readiness, production writes or UI saves.
Phase 4H staging callback/JWKS fetch-cache design is implemented without route enablement, Microsoft redirects, token exchange, default JWKS network fetch, session cookies, production auth readiness, production writes or UI saves.
Phase 5A production hosting/environment decision pack is implemented without deployment, production database commands, production migrations, production auth readiness, production writes or UI saves.
Phase 5B accepts Vercel + Neon hosting/database direction in ADR 0009 without deployment, production database creation, production migrations, production auth readiness, production writes or UI saves.
Phase 5C Vercel + Neon staging setup planning is implemented without creating live Vercel/Neon resources, deployment, secrets, production database commands, production auth readiness, production writes or UI saves.
Phase 5D staging resource creation runbook and approval checklist are implemented without creating live Vercel/Neon resources, deployment, secrets, database commands, production auth readiness, production writes or UI saves.
Phase 5G accepts Supabase Postgres as the managed PostgreSQL direction replacing Neon without creating Vercel/Supabase resources, deployment, secrets, database commands, production auth readiness, production writes or UI saves.
Phase 5I accepts Railway + Railway Postgres as the staging direction without creating Railway resources, deployment, secrets, database commands, production auth readiness, production writes or UI saves.
Phase 8A read-only admin review workspace is implemented without deployment, database commands, live auth, UI saves, production writes, payment gateways or product workflow actions.
Phase 8C read-only admin core review modules are implemented with demo-only Clients, Matters and Documents records and demo detail previews, without deployment, database commands, live auth, UI saves, production writes, file storage or client/matter/document CRUD.
Phase 8G read-only client-file-first admin simplification is implemented with Client Files as the primary workspace and Invoice Items as reusable billing templates, without deployment, database commands, live auth, UI saves, production writes, file storage, LLM calls, client/matter/document CRUD or invoice/statement actions.
Phase 9A Railway-staging client-file creation is implemented behind the staging admin password session and `BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED=true`, without schema changes, `db:push`, production writes, live Entra auth, uploads, LLM calls, Lexpro sync or invoice/statement actions.
Phase 9B Railway-staging test document uploads and reusable billing template edits are implemented behind the staging admin password session, `BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED=true` and `BURGESS_STAGING_BILLING_ITEMS_ENABLED=true`, without `db:push`, production writes, live Entra auth, public storage, LLM calls, Lexpro sync or invoice/statement approval/sending.
Phase 9C Railway-staging document view/download is implemented for uploaded test documents inside protected client files only, without `db:push`, production writes, live Entra auth, public document URLs, public storage, LLM calls, Lexpro sync or invoice/statement approval/sending.
Phase 9D Railway-staging matter creation is implemented inside saved client files only behind the staging admin password session and `BURGESS_STAGING_MATTER_WRITES_ENABLED=true`, without schema changes, `db:push`, production writes, live Entra auth, standalone matter creation, matter edit/close/archive/delete, LLM calls, Lexpro sync or invoice/statement approval/sending.

Phase 9E Railway-staging matter documents and legal timeline notes are implemented for saved staging matters only. They use existing `DocumentRecord`, `DocumentContent`, `MatterNote`, `TimelineEvent` and `AuditLog` models behind staging document and matter gates, without schema changes, `db:push`, production writes, live Entra auth, matter edit/close/archive/delete, LLM calls, Lexpro sync or invoice/statement approval/sending.

Phase 9F improves staging admin form layout only. It applies a shared stacked form pattern across live staging admin forms without changing schemas, routes, gates, database behavior, production writes, live Entra auth, integrations or financial approval behavior.

Phase 9G separates client general document wording/default filename guidance from matter-specific document wording. Client file documents are for ID, proof of address, FICA, authority and general client-file documents; matter documents remain inside matter pages. It adds no schema change, migration, route behavior change, production write, live auth or integration.

Phase 9H adds Railway-staging matter draft billing lines, draft invoice creation and client draft statement lines behind `BURGESS_STAGING_MATTER_INVOICES_ENABLED=true`. It uses existing billing, invoice and statement models only and does not approve invoices, assign official invoice numbers, generate PDFs, send statements, run migrations, enable production writes, enable live auth or sync integrations.

Phase 10A redesigns the protected admin staging UI into a denser practice-file workflow inspired by legal practice management systems. `/admin/clients` is the primary Files workspace, client details keep general documents and statement context, and matter pages hold matter documents, notes / voice-note summaries, billing, draft invoices and statement pull-through. It adds no schema change, migration, `db:push`, production write, live auth, official invoice numbering, approval, PDF generation, sending, payment gateway, WhatsApp, Lexpro sync or LLM action.

## Current Direction

- TypeScript.
- Next.js App Router.
- Modular monolith.
- PostgreSQL-ready architecture.
- Prisma ORM direction.
- Zod boundary validation.
- Server-side service/domain modules.
- Vitest for unit/service tests.
- Provider-neutral auth boundary.
- Prisma foundation models for users, roles, permissions, audit logs and agent actions.
- Tested role permission policy.
- Tested audit event boundary.
- Prisma foundation models for clients, contacts, matters, assignments, notes, document metadata and timeline events.
- Tested client/matter/document/timeline domain helpers.
- Prisma foundation models for billing line items, invoices, invoice approvals, invoice number sequences, statement snapshots, statement approvals and financial correction records.
- Tested money, VAT, invoice approval, statement approval and financial correction helpers.
- Reviewed migration strategy and ADR.
- Repository interfaces with protected-record boundaries.
- Dev-only seed skeleton and deterministic fake fixtures.
- Local-only development migration path.
- Guarded fake users/roles seed writes.
- Database integration tests isolated behind `pnpm run test:db`.
- Protected `/admin` shell route with placeholder-only cards.
- Local/dev auth boundary for shell protection; production auth remains unresolved.
- Protected `/admin/dashboard` route with read-only, role-filtered demo placeholder sections.
- Client/matter service functions wrap repository interfaces with admin access checks and safe typed errors.
- Protected `/admin/clients` renders the primary Files module as a dense searchable Railway-staging practice list. `/admin/clients/new` can create a minimal staging test client file only when the staging write gate is enabled. `/admin/clients/[slug]` renders saved staging client details, can create/list staging matters when the matter gate is enabled, can upload private staging test general client documents when the document gate is enabled, and can view/download those uploaded test documents through protected audited routes. Client file document uploads are labelled as General Documents for ID, proof of address, FICA, company registration, authority / mandate and general correspondence. Matter edit/close/archive, production writes, official invoice approval/sending, public links and LLM behavior remain blocked.
- Protected `/admin/matters` renders saved staging matters as a searchable list. New matter creation starts from a saved client file only. Matter detail pages keep Matter Documents for matter-specific documents only, with the visible matter/reference label and protected view/download routes.
- Protected `/admin/matters/[id]` can add draft matter billing lines and create draft matter invoices when the staging matter invoice gate is enabled. Draft invoices pull into the client file statement panel as draft-only lines.
- Protected `/admin/invoice-items` renders reusable Invoice Items. In Phase 9B it can create/edit staging billing templates when the billing gate is enabled; it cannot apply items to invoices, approve invoices, assign invoice numbers or send statements.
- Protected `/admin/matters` renders a read-only Matters Review module using fake demo records, and `/admin/matters/[id]` renders approved demo-only matter detail previews.
- Protected `/admin/documents` renders a read-only Documents Review module using fake metadata records, and `/admin/documents/[slug]` renders approved demo-only document detail previews.
- Protected `/admin/clients/new` and `/admin/matters/new` render disabled future-phase form foundations only.
- Protected `/admin` renders a read-only admin review workspace with a section-by-section review checklist.
- Protected admin section routes exist for documents, billing, Lexpro boundary, audit trail and access control as read-only placeholders.
- Auth sessions map through fail-closed role mapping before becoming domain principals.
- Mutation-capable service functions require service context, permission checks and audit metadata.
- Local-only Prisma client/matter repository adapters can be exercised through guarded DB tests.
- Audited mutations can run audit recording and repository mutation through an injected transaction boundary.
- ADR 0006 records AuditLog as the immediate internal outbox-equivalent; a separate outbox table is deferred.
- Local/dev service composition wires Prisma client/matter/audit repositories and transaction boundary for backend-only tests.
- Client/matter write feature and release gates default off.
- Future mutation entrypoints must pass production-compatible principal, service context, permission, audit metadata, transaction boundary and release-gate checks before service mutation code runs.
- Production auth adapter/readiness boundary exists, and Microsoft Entra ID / Microsoft 365 identity is the accepted provider direction.
- Disabled client/matter mutation skeletons exist as server modules only and remain unwired from UI/routes.
- Dev-only client/matter mutation functions exist behind explicit local/dev gates and local/dev composition.
- Dev-only mutation functions require fake `DEMO-*` account numbers.
- Dev/staging readiness checklist lives at `docs/architecture/dev-staging-readiness-checklist.md`.
- Local DB helper scripts target only `localhost` and `burgess_attorneys_dev`.
- Production auth provider decision pack lives at `docs/architecture/production-auth-provider-decision-pack.md`.
- Accepted auth direction is Microsoft Entra ID / Microsoft 365 identity, pending tenant/admin access confirmation, MFA policy, role claim approach, environment configuration, staging validation and production readiness review.
- Entra config parsing, issuer helpers, claim mapping and adapter skeletons live under `src/auth/entra`.
- Disabled Entra login/callback/logout route placeholders live under `app/api/auth/entra` and return `entra_auth_not_enabled`.
- OAuth state/nonce and PKCE helpers live under `src/auth/oauth`; Entra token/JWKS skeletons live under `src/auth/entra`.
- OAuth state store boundary lives at `src/auth/oauth/oauth-state-store.ts`; JWKS cache boundary lives at `src/auth/entra/entra-jwks-cache.ts`.
- Disabled Entra staging wiring lives at `src/auth/entra/entra-staging-wiring.ts` and route dependency composition lives at `src/auth/entra/entra-route-dependencies.ts`.
- Entra JWKS key selection lives at `src/auth/entra/entra-jwks-key-selection.ts`; JWT verifier boundary lives at `src/auth/entra/entra-jwt-verifier.ts`.
- Entra `jose` adapter lives at `src/auth/entra/entra-jose-verifier.ts` and uses injected JWK material only.
- Phase 4H callback/JWKS fetch-cache design lives at `docs/architecture/entra-staging-callback-jwks-fetch-cache-design.md` and is documentation-only.
- PR #1 was squash merged to `origin/main` at `57dccc1`, and local `main` has been synced to that squash merge.
- Phase 5A hosting/environment decision pack lives at `docs/architecture/production-hosting-environment-decision-pack.md`.
- ADR 0011 accepts Railway for staging app hosting and Railway Postgres for the staging database. ADR 0011 supersedes the active Vercel + Supabase staging direction.
- Railway implementation checklist lives at `docs/architecture/railway-implementation-checklist.md`.
- Railway staging checklist lives at `docs/architecture/railway-staging-setup-checklist.md`.
- Phase 5I plan lives at `docs/plans/phase-5i-railway-staging-direction.md`.
- Phase 8A plan lives at `docs/plans/phase-8a-admin-review-workspace.md`.
- Admin section review map lives at `docs/architecture/admin-section-review-map.md`.
- ADR 0010 Vercel + Supabase and ADR 0009 Vercel + Neon remain historical unless later re-approved.
- Vercel/Supabase implementation checklist lives at `docs/architecture/vercel-supabase-implementation-checklist.md`.
- Historical Vercel/Neon implementation checklist lives at `docs/architecture/vercel-neon-implementation-checklist.md`.
- Phase 5C staging setup plan lives at `docs/plans/phase-5c-vercel-neon-staging-setup-plan.md`.
- Vercel staging checklist lives at `docs/architecture/vercel-staging-setup-checklist.md`.
- Supabase staging checklist lives at `docs/architecture/supabase-staging-setup-checklist.md`.
- Historical Neon staging checklist lives at `docs/architecture/neon-staging-setup-checklist.md`.
- Environment variable template lives at `docs/architecture/environment-variable-template.md`.
- Staging pre-deploy checklist lives at `docs/architecture/staging-predeploy-checklist.md`.
- Phase 5D staging resource creation runbook lives at `docs/architecture/staging-resource-creation-runbook.md`.
- Phase 5D approval checklist lives at `docs/architecture/staging-resource-approval-checklist.md`.
- xneelo remains DNS/domain/public website only unless xneelo Cloud/Managed Server is explicitly required.
- Production deployment, production database creation, secrets, live auth and production writes remain pending.

See:

- `docs/architecture/technical-architecture.md`
- `docs/architecture/domain-model.md`
- `docs/adr/`

## Current Confirmed Boundaries

- Burgess platform: source of truth for invoices and client-facing statement PDFs.
- Lexpro: source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.
- Invoice numbers: assigned only on owner/principal approval.
- Agent: draft-only service user by default.
- Client documents: metadata only in Phase 1B and private by default.
- Money: integer cents only.
- Invoice numbers: nullable until owner/principal approval.
- Statements: snapshots, not live mutable views.
- Production migrations: never run automatically by agents.
- Seed data: fake only, no real client data.
- Normal pre-PR checks: must not require a running database.
- Admin shell: placeholder only, no CRUD or protected workflow actions.
- Admin dashboard: demo placeholder data only, no live counts or workflow actions.
- Client/matter services: no hard-delete operation, no API route exposure yet, and no normal-test database dependency.
- Client/matter UI: read-only demo display only, no edit/delete/send/approve actions.
- Client/matter form foundations: disabled only, no submit action or persistence.
- Audited persistence enablement: service boundary only; forms remain disabled and no live database write is exposed.
- Phase 3B Prisma adapters: local repository boundary only; no UI save, API mutation route or production DB operation is exposed.
- DB-specific tests: isolated behind `pnpm run test:db` and guarded to local `burgess_attorneys_dev`.
- Phase 3C transaction boundary: service-layer preparation only; no UI save, server action, API mutation route or production DB operation is exposed.
- Phase 3D local/dev composition: backend test composition only; app UI routes must not import it.
- Phase 3E mutation gating: design/helper only; no server action, API mutation route, live UI save, production auth provider, migration or production DB operation is exposed.
- Phase 3F disabled skeletons: server-module tests only; no UI wiring, active server action, API mutation route, live save, migration or production DB operation is exposed.
- Phase 3G dev-only writes: backend mutation functions only; no UI save, active production save button, API mutation route, production auth provider, migration or production DB operation is exposed.
- Phase 3H local DB validation: docs/scripts/checklist only; DB tests require local PostgreSQL and remain optional/guarded.
- Phase 3J auth decision pack: docs only; no provider integration, secrets, login flow, production write or UI save is exposed.
- Phase 3K.1 auth decision ADR: Microsoft Entra ID / Microsoft 365 identity accepted as direction only; no provider integration, secrets, production auth readiness, production write or UI save is exposed.
- Phase 4A Entra skeleton: config/parser/claim adapter tests only; no live OAuth, callback route, session creation, production auth readiness, production write or UI save is exposed.
- Phase 4B Entra route placeholders: login/callback/logout routes return disabled JSON only; no Microsoft redirect, token exchange, session cookie, production auth readiness, production write or UI save is exposed.
- Phase 4C OAuth security skeleton: state/nonce, PKCE and token/JWKS helpers only; complete placeholder tokens still require cryptographic verification and do not authenticate users.
- Phase 4D storage/cache boundaries: state store and JWKS cache interfaces only; no live cookies, default network fetch, authenticated token, production write or UI save is exposed.
- Phase 4E staging wiring: dependency composition only; explicit staging wiring does not enable live routes, sessions, production auth readiness, production writes or UI saves.
- Phase 4F verifier boundary: JWT/JWKS interfaces and fake/local tests only; decoded claims do not authenticate without an injected verifier and live routes remain disabled.
- Phase 4G `jose` adapter: fake/local token verification only; no live route import, Microsoft JWKS fetch, session, production auth readiness, production write or UI save is exposed.
- Phase 4H callback/JWKS fetch-cache design: documentation and checklists only; no route enablement, Microsoft network fetch, token exchange, session, production auth readiness, production write or UI save is exposed.
- Phase 5A hosting/environment decision pack: documentation only; no deployment, production database command, production migration, production auth readiness, production write or UI save is exposed.
- Phase 5B Vercel/Neon direction: accepted architecture decision only; no deployment, production database creation, production migration, live auth, production write or UI save is exposed.
- Phase 5C staging setup plan: documentation/templates/checklists only; no Vercel project, Neon database, deployment, secret, production database command, live auth, production write or UI save is exposed.
- Phase 5D staging resource runbook: documentation/checklists only; no Vercel project, Neon database, deployment, secret, database command, live auth, production write or UI save is exposed.
- Phase 5G Supabase database-provider direction: accepted architecture decision and checklist updates only; no Supabase project, deployment, secret, database command, live auth, production write or UI save is exposed.
- Phase 5I Railway staging direction: accepted architecture decision and checklist updates only; no Railway resource, deployment, secret, database command, live auth, production write or UI save is exposed.
- Phase 8A admin review workspace: private admin review UI only; no deploy, migration, `db:push`, live auth, UI save, production write, payment gateway, Yoco, Payfast, shop, checkout, invoice workflow, WhatsApp, Lexpro import or email sending is exposed.
- Phase 8C admin core review modules: private read-only demo UI only; no deploy, migration, `db:push`, real client/matter/document data entry, document upload/download/storage, live auth, UI save, production write, payment gateway, invoice workflow, WhatsApp, Lexpro import or email sending is exposed.
- Phase 8G client-file simplification: private read-only demo UI only; no deploy, migration, `db:push`, real data entry, document upload/download/storage, LLM call, live auth, UI save, production write, payment gateway, invoice approval, statement sending, WhatsApp, Lexpro import or email sending is exposed.
- Phase 9A staging client-file creation: private Railway-staging UI can create minimal test client/contact/audit/timeline records only when the staging admin password session and `BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED=true` are present. No schema change, `db:push`, production write, live Entra auth, upload, matter write, billing write, invoice approval, statement sending, LLM call, WhatsApp, Lexpro sync or payment feature is exposed.
- Phase 9B staging document and billing templates: private Railway-staging UI can upload test documents and create/edit reusable billing templates only when the staging admin password session and the matching Phase 9B gates are present. No `db:push`, production write, live Entra auth, public storage, matter write, invoice approval, statement sending, LLM call, WhatsApp, Lexpro sync or payment feature is exposed.
- Phase 9C staging document view/download: private Railway-staging UI can view and download uploaded test documents only from protected client file routes when the staging admin password session and document gate are present. No public document URL, public storage, production document storage, production write, live Entra auth, document sharing, invoice approval, statement sending, LLM call, WhatsApp, Lexpro sync or payment feature is exposed.
- Phase 9D staging matters: private Railway-staging UI can open and list staging test matters inside saved client files only when the staging admin password session and matter gate are present. No production write, live Entra auth, standalone matter creation, matter edit/close/archive/delete, invoice approval, statement sending, LLM call, WhatsApp, Lexpro sync or payment feature is exposed.
- Phase 9G document distinction: client file documents and matter documents are separated by UI wording and filename guidance only. No schema change, migration, route behavior change, gate change, production write, live auth, invoice/statement action, LLM call, WhatsApp, Lexpro sync or payment feature is exposed.
- Phase 9H draft invoicing: private Railway-staging UI can create draft matter billing lines, draft matter invoices and client draft statement lines only when the staging admin password session and matter invoice gate are present. No production write, live Entra auth, invoice approval, official invoice number, PDF generation, sending, payment, LLM call, WhatsApp or Lexpro sync is exposed.
- Phase 10A admin redesign: protected staging UI is denser and matter-centric, but it only rearranges existing safe staging capabilities. No schema change, migration, `db:push`, production write, live auth, approval, official invoice number, PDF generation, sending, payment, LLM call, WhatsApp or Lexpro sync is exposed.
- Agent service users: blocked from normal admin shell navigation.

## ADR Candidates

`docs/adr/` exists because Phase 0 accepted the first ADRs.

Known future ADR candidates:

- Burgess platform source of truth for invoices and client-facing statement PDFs.
- Lexpro retained for legal/trust accounting and reconciled payment records.
- Invoice number assigned only on owner/principal approval.
- Hosting choice.
- File storage choice.
- WhatsApp integration choice.
- Email integration choice.
