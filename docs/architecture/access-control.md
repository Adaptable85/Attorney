# Access Control

Date/time: 2026-06-27 08:45:25 SAST

## Current Phase

Phase 8E adds proposal-only access-control review content. It does not enable production auth, Microsoft Entra live login, user management, role editing, UI saves or production writes.

## Current Staging Access

Staging admin review uses the existing password-backed `Read-Only Reviewer` path. This is review access only and does not replace the accepted Microsoft Entra production-auth direction.

## Proposed Role Review

The `/admin/access` page now displays a read-only matrix for:

- Principal Attorney / Owner.
- Attorney / Professional Staff.
- Admin / Reception.
- Finance / Billing Reviewer.
- Build Support.
- Draft-only Assistant / Service User.
- Read-Only Reviewer.

Permissions are proposal-only for:

- View clients.
- View matters.
- View documents.
- View billing summaries.
- Prepare draft records.
- Approve records.
- Manage access.
- View audit trail.
- Configure integrations.

## Explicitly Not Enabled

- No invites.
- No role changes.
- No user removal.
- No Microsoft login enablement.
- No SSO configuration.
- No secret viewing.
- No production auth readiness.
- No production writes.

## Future Preconditions

Production access control requires:

- Accepted Microsoft Entra validation.
- Role mapping approval.
- Audit event design for access changes.
- Owner/principal control over high-risk roles.
- Time-limited support-access policy.
- Staff departure/offboarding policy.
