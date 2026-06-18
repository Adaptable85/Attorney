# AI Memory

## Learned Context

- The project should start with the internal legal-admin and billing platform.
- Website, marketing, outreach and deeper agent automation are later phases.
- Financial details that are not confirmed must remain configurable.
- Phase -1 must not build product features.
- Hooks must be deterministic and must not call AI models.

## Guardrails To Preserve

- Draft invoices use internal draft IDs only.
- Official invoice numbers are assigned only on owner/principal approval.
- No invoice or statement is sent without owner/principal approval.
- OpenClaw remains draft-only unless the owner explicitly approves a future permission change.
- Lexpro remains source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.

