# Matters Section Review

Date/time: 2026-06-27 07:44:27 SAST

Phase 8C expands the Matters section into a read-only review module for Stephanie. It is demo-only and does not enable matter creation, editing, closing, uploads, approvals, saves, production writes, migrations or deployment.

## Scope Completed

- `/admin/matters` now renders `Matters Review` with a clear safety banner.
- The page shows six fake demo matter records linked to fake demo clients.
- Demo matter examples cover property/conveyancing, estate/trust, commercial, litigation/dispute, family/personal and general consultation work.
- Each demo matter shows title, reference placeholder, linked client, matter type, status, priority, responsible person, opened date, next key date, document status, billing/statement context and review note.
- `/admin/matters/[id]` now serves demo-only matter previews for approved demo slugs.
- Matter detail previews show linked client, linked documents, communication summary, billing/statement summary and audit/review notes.
- `/admin/matters/new` remains blocked/non-writing.

## Review Prompts

The Matters Review page asks Stephanie to confirm:

- What matter types Burgess must support first.
- Which statuses match the real office workflow.
- Whether every matter needs a responsible person.
- Which dates are critical.
- Whether matters should show missing documents.
- Whether billing/statement context belongs on matters.
- Who may view matters.
- Who may eventually create, update or close matters.
- What should happen before a matter can be closed.

## Future Workflow Preview

The future workflow is displayed as non-live review copy only:

- New matter opened.
- Client and matter type confirmed.
- Critical dates captured.
- Documents requested and tracked.
- Notes and client communication logged.
- Billing/statement context reviewed where applicable.
- Audit trail records all changes.

No write path is enabled in this phase.

## Safety Confirmation

- No real matter data should be entered.
- No real matter records are created.
- No database schema change or migration was added.
- No `db:push` was run.
- No deployment was run.
- Live Microsoft Entra auth remains disabled.
- UI saves and production writes remain disabled.
- Public website pages still expose no admin link.
- No payment gateway, Yoco, Payfast, shop, checkout or membership functionality was added.

## Next Recommended Section

Review the Documents section alongside Clients and Matters, then move to Billing/Lexpro review.
