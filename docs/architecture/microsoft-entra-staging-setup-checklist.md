# Microsoft Entra Staging Setup Checklist

Status: Phase 4C checklist with OAuth skeleton
Date: 2026-06-23

No real tenant, client or secret values belong in this document.

## Tenant And Access

- Confirm Burgess Microsoft 365 tenant exists.
- Confirm Entra admin access for the owner-approved administrator.
- Confirm who can create and maintain app registrations.
- Confirm break-glass admin account and recovery process.

## Staging App Registration

- Create a staging-only app registration.
- Use a staging display name that clearly separates it from production.
- Record the staging tenant ID outside Git.
- Record the staging client ID outside Git.
- Store the client secret only in approved secret storage.
- Configure redirect URI placeholder: `<staging-origin>/api/auth/entra/callback`.
- Configure callback URI placeholder: `<staging-origin>/api/auth/entra/callback`.
- Configure logout URI placeholder: `<staging-origin>/api/auth/entra/logout`.

## Access Policy

- Define allowed email domains.
- Define any explicit allowed user list.
- Confirm role claim approach.
- Confirm values map only to `OWNER_PRINCIPAL`, `SUPPORT_ADMIN`, `AGENT_SERVICE` and `READ_ONLY_REVIEWER`.
- Require MFA or conditional access for human users.
- Confirm owner/principal and support admin MFA requirements.

## Environment Variables

Placeholder names only:

- `AUTH_PROVIDER=entra`
- `AUTH_ENTRA_TENANT_ID=`
- `AUTH_ENTRA_CLIENT_ID=`
- `AUTH_ENTRA_CLIENT_SECRET=`
- `AUTH_ENTRA_REDIRECT_URI=`
- `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS=`
- `AUTH_ENTRA_ROLE_CLAIM=`
- `AUTH_PRODUCTION_READY=false`
- `BURGESS_PRODUCTION_AUTH_PROVIDER=microsoft_entra_id`
- `BURGESS_PRODUCTION_AUTH_ENABLED=false`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED=false`
- `BURGESS_PRODUCTION_WRITES_ENABLED=false`

## Environment Separation

- Local development uses placeholders only.
- Staging uses staging app registration values only.
- Production uses a separate production app registration only after approval.
- Never reuse staging client secrets in production.
- Never downgrade production to local/dev placeholder auth.

## Validation Checklist

- Missing config fails closed.
- `AUTH_PROVIDER=entra` alone fails closed.
- Callback route returns disabled until live implementation is accepted.
- Login route does not redirect to Microsoft until live implementation is accepted.
- Logout route does not mutate cookies until live implementation is accepted.
- State and nonce values expire and reject unsafe redirect targets.
- PKCE verifier and challenge helpers are tested.
- Token claim-shape checks reject missing or mismatched issuer, audience, tenant, nonce, subject, email and domain.
- Complete placeholder tokens still require cryptographic JWKS verification.
- Role mapping rejects unknown role claims.
- Agent and read-only roles cannot create client/matter records.
- Production writes remain disabled.

## Rollback Checklist

- Disable auth readiness flags.
- Disable production write flags.
- Remove or rotate staging secrets in approved secret storage.
- Revoke test sessions if sessions exist in a future phase.
- Preserve audit logs for attempted auth activity.
