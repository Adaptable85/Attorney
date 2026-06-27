# Admin Section Review Map

Date/time: 2026-06-27 07:44:27 SAST

Phase 8A adds a read-only admin review workspace for structure review only. It does not approve writes, live authentication, migrations, deployment or production data entry.

Phase 8B deployed this workspace to Railway staging at `https://attorney-web-production.up.railway.app` and verified the route map as read-only. Deployment ID `e4e41b91-cfc8-42db-b0a9-771c77219b1a` reached `SUCCESS`.

Phase 8C builds the local admin core review pack for Clients, Matters and Documents. No deployment was run for Phase 8C.

Phase 8D deployed the core admin review pack to Railway staging. Deployment ID `0f13e881-ce79-4439-ae83-8d325ba9d3c3` reached `Online`, and read-only smoke checks passed for public routes, admin workspace, Clients, Matters, Documents and demo detail routes.

Phase 8E builds the local back-office review pack for Billing, Lexpro, Audit and Access. No deployment was run for Phase 8E.

## Sections

| Section | Route | Current state | Future review focus |
| --- | --- | --- | --- |
| Review workspace | `/admin` | Private read-only overview and checklist | Confirm the admin structure and section order |
| Dashboard | `/admin/dashboard` | Demo placeholder dashboard | Confirm workload, next-step and audit summary shape |
| Clients | `/admin/clients` | Full read-only Clients Review module with demo-only client detail previews at `/admin/clients/[demo-slug]` | Confirm client fields, statuses, contact rules, linked-matter expectations and archive/search behavior |
| Matters | `/admin/matters` | Full read-only Matters Review module with demo-only matter detail previews at `/admin/matters/[demo-slug]` | Confirm matter fields, statuses, key dates, document tracking and closure expectations |
| Documents | `/admin/documents` | Full read-only Documents Review module with demo-only metadata previews at `/admin/documents/[demo-slug]` | Confirm document categories, privacy labels, required flags and audit expectations |
| Billing | `/admin/billing` | Full read-only Billing Review module with demo billing detail previews at `/admin/billing/[demo-slug]` | Confirm draft invoice/statement review, principal approval boundaries, Lexpro boundaries and client-query handling |
| Lexpro boundary | `/admin/lexpro` | Full read-only Lexpro Boundary Review module with demo boundary detail previews at `/admin/lexpro/[demo-slug]` | Confirm source-of-truth wording, trust/accounting boundaries and any future display-only summaries |
| Audit trail | `/admin/audit` | Full read-only Audit Trail Review module with demo event previews at `/admin/audit/[demo-slug]` | Confirm actor/action/timestamp/reason expectations, retention and export approval boundaries |
| Settings/access control | `/admin/access` | Full read-only Access Control Review module with proposal-only role matrix | Confirm staff roles, owner powers, build support limits and service-user boundaries |

## Read-Only Guarantees

- Demo placeholder data only.
- No real Burgess client, matter, document or financial data.
- No save/create/submit action.
- No approval, sending, upload, sync or external collection action.
- No live Microsoft Entra login.
- No UI saves.
- No production writes.
- No public admin link from public website routes.
- Railway staging verification confirmed these routes return read-only content after password access.
- Phase 8C expands Clients, Matters and Documents locally only; no deployment was run for that phase.
- Document pages expose metadata review only; no upload, download or storage action is enabled.
- Phase 8E expands Billing, Lexpro, Audit and Access locally only; no deployment was run for that phase.
- Billing, Lexpro, Audit and Access pages remain demo-only and read-only.

## Billing Boundary

The billing section is limited to invoice and statement structure review. It includes no payment provider, checkout flow, online collection route or third-party commerce integration. Billing is not payment collection. Lexpro remains the accounting source of truth for trust, bookkeeping and reconciled records.

## Access Boundary

The staging password path grants the `READ_ONLY_REVIEWER` role for review. Microsoft Entra remains the accepted production auth direction, but live redirect, token exchange, session readiness and production writes remain disabled until separately approved.

The Phase 8E access matrix is proposal-only. It does not enable invites, role changes, user removal, Microsoft login, SSO configuration, secret viewing, UI saves or production writes.

## Future Preconditions Before Writes

- Production-compatible authenticated principal.
- Permission checks.
- Audited service context.
- Transaction boundary.
- Explicit release gates.
- Owner/principal approval workflow for protected legal and financial actions.
- Reviewed migration and rollback plan where schema changes are involved.
