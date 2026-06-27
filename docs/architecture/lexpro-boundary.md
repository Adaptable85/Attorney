# Lexpro Boundary

Date/time: 2026-06-27 08:45:25 SAST

## Decision Context

Lexpro remains the authoritative system for legal accounting, trust accounting, reconciled payments, compliance records and official accounting outputs where applicable. The Burgess platform may later prepare operational summaries and client-facing draft views, but it must not replace Lexpro accounting controls.

## Phase 8E Boundary

Phase 8E adds read-only Lexpro boundary review pages only:

- `/admin/lexpro`
- `/admin/lexpro/[demo-slug]`

The pages contain demo-only review items and disabled future action labels. There is no live integration.

## Explicitly Not Enabled

- No Lexpro API calls.
- No import/export.
- No sync.
- No credentials.
- No secrets.
- No write-back.
- No reconciliation job.
- No production database command.
- No migration.

## Future Preconditions

Any future Lexpro integration requires:

- Principal attorney approval.
- Security review.
- Data mapping review.
- Source-of-truth rules.
- Audit event design.
- Rollback plan.
- Separate validation and staging smoke tests.

## Highest-Risk Areas

- Trust accounting.
- Reconciled payment status.
- Compliance records.
- Official accounting outputs.
- Any write-back to Lexpro.
