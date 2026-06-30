# Access Control Review

Date/time: 2026-06-27 08:45:25 SAST

## Summary

Phase 8E expands `/admin/access` into a read-only Access Control Review module. It presents a proposal-only role matrix for review while keeping staging password access, Microsoft Entra and production write gates unchanged.

## Proposed Roles

- Principal Attorney / Owner.
- Attorney / Professional Staff.
- Admin / Reception.
- Finance / Billing Reviewer.
- Build Support.
- Draft-only Assistant / Service User.
- Read-Only Reviewer.

## Safety Status

- Staging password access remains read-only.
- Microsoft Entra live auth is not enabled.
- Production auth is not enabled.
- No role changes.
- No user management.
- No invites.
- No password display.
- No secrets.
- No UI saves.
- No production writes.

## Review Questions

- Who should be the production owner?
- Which staff roles are needed first?
- Who may view all clients and matters?
- Who may view billing summaries?
- Who may approve invoices/statements later?
- Who may manage users?
- Should build support have time-limited access?
- Should assistant/service users be draft-only?
- What should happen when a staff member leaves?

## Next Step

Deploy/smoke this read-only module in a later staging phase, then review the proposed matrix with Stephanie before production auth or user management is considered.

## Phase 8F Staging Verification

Date/time: 2026-06-27 14:02:07 SAST

Phase 8F deployed the Access Control Review module to Railway staging deployment `2a1c589e-59aa-4b24-946f-09d05c2056f4`.

- `/admin/access` returned `200` and rendered `Access Control Review`.
- The proposal-only role matrix rendered, including `Principal Attorney / Owner` and `Read-Only Reviewer`.
- Demo-only/read-only markers were visible.
- No user invite, role change, user removal, Microsoft login enablement, SSO configuration or secret view control was active.
- Microsoft Entra login/callback remained disabled.
