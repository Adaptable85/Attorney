# Admin Section Review Map

Date/time: 2026-06-26 16:11:18 SAST

Phase 8A adds a read-only admin review workspace for structure review only. It does not approve writes, live authentication, migrations, deployment or production data entry.

Phase 8B deployed this workspace to Railway staging at `https://attorney-web-production.up.railway.app` and verified the route map as read-only. Deployment ID `e4e41b91-cfc8-42db-b0a9-771c77219b1a` reached `SUCCESS`.

## Sections

| Section | Route | Current state | Future review focus |
| --- | --- | --- | --- |
| Review workspace | `/admin` | Private read-only overview and checklist | Confirm the admin structure and section order |
| Dashboard | `/admin/dashboard` | Demo placeholder dashboard | Confirm workload, next-step and audit summary shape |
| Clients | `/admin/clients` | Full read-only Clients Review module with demo-only client detail previews at `/admin/clients/[demo-slug]` | Confirm client fields, statuses, contact rules, linked-matter expectations and archive/search behavior |
| Matters | `/admin/matters` | Demo placeholder matter list/detail | Confirm matter fields, status labels and next-step shape |
| Documents | `/admin/documents` | Private-document placeholder | Confirm document categories, privacy labels and audit expectations |
| Billing | `/admin/billing` | Invoice/statement structure placeholder | Confirm approval fields and statement summary shape |
| Lexpro boundary | `/admin/lexpro` | Accounting boundary placeholder | Confirm source-of-truth wording and future reconciliation visibility |
| Audit trail | `/admin/audit` | Sensitive-action placeholder | Confirm actor/action/timestamp/reason expectations |
| Settings/access control | `/admin/access` | Role and gate placeholder | Confirm user roles and release-gate review expectations |

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
- Phase 8C expands Clients locally only; no deployment was run for that phase.

## Billing Boundary

The billing section is limited to invoice and statement structure review. It includes no payment provider, checkout flow, online collection route or third-party commerce integration. Lexpro remains the accounting source of truth for trust, bookkeeping and reconciled records.

## Access Boundary

The staging password path grants the `READ_ONLY_REVIEWER` role for review. Microsoft Entra remains the accepted production auth direction, but live redirect, token exchange, session readiness and production writes remain disabled until separately approved.

## Future Preconditions Before Writes

- Production-compatible authenticated principal.
- Permission checks.
- Audited service context.
- Transaction boundary.
- Explicit release gates.
- Owner/principal approval workflow for protected legal and financial actions.
- Reviewed migration and rollback plan where schema changes are involved.
