# Microsoft Entra Implementation Plan

Status: Phase 4C OAuth security skeleton
Date: 2026-06-23

## Current State

Microsoft Entra ID / Microsoft 365 identity is the accepted production auth provider direction. Phase 4A added a provider-specific skeleton. Phase 4B added staging setup documentation, callback/session architecture, disabled route placeholders and session shape validation. Phase 4C adds OAuth state/nonce helpers, PKCE helpers, JWKS descriptors and token-validation skeletons without live login, secrets, session cookies, production auth readiness or production writes.

Implemented skeleton pieces:

- `src/auth/entra/entra-config.ts`: placeholder-safe config parser.
- `src/auth/entra/entra-issuer.ts`: issuer and OpenID configuration URL helpers with no network calls.
- `src/auth/entra/entra-claims.ts`: Entra-like claim mapping to internal production principals.
- `src/auth/entra/entra-auth-adapter.ts`: adapter skeleton that fails closed until config and production readiness are present.
- `src/auth/entra/entra-route-handlers.ts`: disabled route response helpers.
- `src/auth/session-shape.ts`: future session shape validation without session creation.
- `app/api/auth/entra/login/route.ts`: disabled login placeholder.
- `app/api/auth/entra/callback/route.ts`: disabled callback placeholder.
- `app/api/auth/entra/logout/route.ts`: disabled logout placeholder.
- `src/auth/oauth/oauth-state.ts`: state/nonce payload helpers.
- `src/auth/oauth/pkce.ts`: PKCE verifier/challenge helpers.
- `src/auth/entra/entra-token-validation.ts`: fail-closed token-validation skeleton.
- `src/auth/entra/entra-jwks.ts`: JWKS URL descriptor without network calls.

## Required Before Live Implementation

- Confirm Burgess Microsoft 365 tenant/admin access.
- Create reviewed staging and production Entra app registrations.
- Confirm MFA enforcement and break-glass process.
- Confirm allowed users/domains.
- Confirm role claim name and role assignment process.
- Store real secrets only in approved secret storage.
- Validate callback URL allowlists.
- Add reviewed OAuth callback/session implementation.
- Add real cryptographic JWT/JWKS validation and reviewed key caching.
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
- Auth route handlers return disabled JSON only and do not redirect to Microsoft.
- Complete placeholder tokens do not authenticate; cryptographic JWKS verification remains required.
- No JWKS or metadata network fetch exists yet.
- Create forms remain disabled.

## Next Phase

The next phase should implement staging-only state/nonce storage and reviewed JWKS metadata fetching behind disabled-by-default readiness gates, still without enabling production writes.
