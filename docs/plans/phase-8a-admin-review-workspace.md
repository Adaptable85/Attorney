# Phase 8A Admin Review Workspace

Date/time: 2026-06-26 16:11:18 SAST

## Goal

Create a polished read-only admin review workspace so Wesley and Stephanie can review the Burgess Attorneys admin structure section by section before any write capability is approved.

## Scope

- Admin review workspace at `/admin`.
- Private admin navigation for dashboard, clients, matters, documents, billing, Lexpro boundary, audit trail and access control.
- Read-only section review pages for documents, billing, Lexpro, audit and access control.
- Clear demo/placeholder labels for client and matter views.
- Regression tests for read-only admin behavior and provider/payment-commerce guardrails.

## Out Of Scope

- No deploy.
- No Railway command.
- No migration or `db:push`.
- No production database command.
- No live Microsoft Entra auth.
- No UI save, create or submit action.
- No production writes.
- No client, matter, invoice, statement, WhatsApp, Lexpro or email workflow.
- No Yoco, Payfast, shop, checkout or payment-gateway functionality.

## Acceptance Criteria

- `/admin` renders a visible section-by-section review workspace for authenticated admin reviewers.
- The `Read-Only Reviewer` role remains visible through the existing role badge.
- Public pages do not link to `/admin`.
- Admin navigation points only at private `/admin/*` routes.
- Clients and matters remain read-only demo placeholders.
- Create client and create matter routes remain blocked/non-writing for reviewers.
- Billing review includes no payment provider or checkout functionality.
- No active save/create/submit controls are introduced in the review workspace or section placeholders.

## Validation

Run:

```sh
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run prisma:validate
pnpm run build
./scripts/check-agent-context.sh
./scripts/check-adr-needed.sh
./scripts/pre-pr-review.sh
pnpm run test:db:local
```

Also perform local route checks:

- Public pages render without an admin link.
- `/admin` without a session renders the password screen.
- Cookie-backed `/admin` renders the review workspace.
- `/admin/clients`, `/admin/matters`, `/admin/documents`, `/admin/billing`, `/admin/lexpro`, `/admin/audit` and `/admin/access` render read-only review content.
- `/admin/clients/new` and `/admin/matters/new` remain blocked/non-writing for the reviewer role.

## Risks / Follow-Up

- The workspace is still demo-only and must not be interpreted as live operational data.
- Stephanie feedback should drive the next admin structure iteration.
- Any future write phase still requires production-auth readiness, audited persistence, explicit release gates and owner approval.

## Phase 8B Staging Verification

Date/time: 2026-06-26 16:37:54 SAST

The Phase 8A workspace was deployed to Railway staging in Phase 8B.

- Staging URL: `https://attorney-web-production.up.railway.app`
- Deployment ID: `e4e41b91-cfc8-42db-b0a9-771c77219b1a`
- Deployment status: `SUCCESS`
- Public pages returned `200` and exposed no admin link.
- `/admin` rendered the password screen without a session.
- Password-backed `/admin` rendered the read-only review workspace.
- Dashboard, clients, matters, documents, billing, Lexpro, audit and access routes rendered read-only content.
- Client and matter create routes remained blocked/non-writing.
- Live Microsoft Entra auth remained disabled.
- UI saves and production writes remained disabled.
- No migration, `db:push`, DNS change, Railway environment change or secret exposure occurred.

Recommended next phase: review the Clients section first with Stephanie.
