# Microsoft Entra Implementation Plan

Status: Phase 4A skeleton only
Date: 2026-06-23

## Current State

Microsoft Entra ID / Microsoft 365 identity is the accepted production auth provider direction. Phase 4A adds a provider-specific skeleton without live login, secrets, sessions, route handlers, production auth readiness or production writes.

Implemented skeleton pieces:

- `src/auth/entra/entra-config.ts`: placeholder-safe config parser.
- `src/auth/entra/entra-issuer.ts`: issuer and OpenID configuration URL helpers with no network calls.
- `src/auth/entra/entra-claims.ts`: Entra-like claim mapping to internal production principals.
- `src/auth/entra/entra-auth-adapter.ts`: adapter skeleton that fails closed until config and production readiness are present.

## Required Before Live Implementation

- Confirm Burgess Microsoft 365 tenant/admin access.
- Create reviewed staging and production Entra app registrations.
- Confirm MFA enforcement and break-glass process.
- Confirm allowed users/domains.
- Confirm role claim name and role assignment process.
- Store real secrets only in approved secret storage.
- Validate callback URL allowlists.
- Add reviewed OAuth callback/session implementation.
- Add audit events for login and failed login.
- Complete staging validation with fake/test users.
- Complete production readiness review.

## Environment Placeholders

`.env.example` contains placeholder names only. Real values must not be committed.

- `AUTH_PROVIDER=entra`
- `AUTH_ENTRA_TENANT_ID=`
- `AUTH_ENTRA_CLIENT_ID=`
- `AUTH_ENTRA_CLIENT_SECRET=`
- `AUTH_ENTRA_REDIRECT_URI=`
- `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS=`
- `AUTH_ENTRA_ROLE_CLAIM=`
- `AUTH_PRODUCTION_READY=false`

## Non-Live Boundaries

- `AUTH_PROVIDER=entra` alone does not enable readiness.
- Complete Entra placeholder config does not enable production writes.
- The adapter skeleton does not exchange tokens.
- No cookies or sessions are created.
- No auth route handlers are exposed in Phase 4A.
- Create forms remain disabled.

## Next Phase

The next phase should configure a staging-only Entra app registration and decide the exact OIDC/session implementation path, still without enabling production writes.

