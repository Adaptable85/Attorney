# Microsoft Entra Implementation Plan

Status: Phase 4G jose JWT/JWKS verifier decision
Date: 2026-06-23

## Current State

Microsoft Entra ID / Microsoft 365 identity is the accepted production auth provider direction. Phase 4A added a provider-specific skeleton. Phase 4B added staging setup documentation, callback/session architecture, disabled route placeholders and session shape validation. Phase 4C added OAuth state/nonce helpers, PKCE helpers, JWKS descriptors and token-validation skeletons. Phase 4D added OAuth state storage and JWKS cache boundaries without live login, secrets, session cookies, default network fetches, production auth readiness or production writes. Phase 4E added disabled-by-default staging dependency wiring for state storage, JWKS cache, PKCE and token-validation markers while keeping routes disabled. Phase 4F added JWT/JWKS verifier and key-selection boundaries. Phase 4G selects `jose` and adds a non-live adapter skeleton without route wiring or production readiness.

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
- `src/auth/oauth/oauth-state-store.ts`: state store boundary with in-memory test adapter.
- `src/auth/entra/entra-jwks-cache.ts`: JWKS metadata cache boundary with injectable fetcher.
- `src/auth/entra/entra-staging-wiring.ts`: disabled-by-default staging dependency wiring.
- `src/auth/entra/entra-route-dependencies.ts`: disabled route dependency composition for future handler injection.
- `src/auth/entra/entra-jwks-key-selection.ts`: local JWKS key selection and algorithm allowlist.
- `src/auth/entra/entra-jwt-verifier.ts`: injected JWT verification boundary with no default verifier.
- `src/auth/entra/entra-jose-verifier.ts`: non-live `jose` adapter using injected JWK material only.

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
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false`

## Non-Live Boundaries

- `AUTH_PROVIDER=entra` alone does not enable readiness.
- Complete Entra placeholder config does not enable production writes.
- The adapter skeleton does not exchange tokens.
- No cookies or sessions are created.
- Auth route handlers return disabled JSON only and do not redirect to Microsoft.
- Complete placeholder tokens do not authenticate; cryptographic JWKS verification remains required.
- JWKS cache requires an injected fetcher and makes no network call by default.
- State store is not wired to cookies or live routes.
- Staging wiring is disabled by default and requires `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=true`, complete placeholder config and a cryptographic verification dependency marker before it returns a non-live dependency bundle.
- Staging wiring does not enable live login, route behavior, production auth readiness or production writes.
- JWT verification has no default route wiring and does not trust decode-only claims.
- `jose` is selected in ADR 0008, but the adapter is not wired to live routes and does not fetch Microsoft JWKS metadata.
- Create forms remain disabled.

## Next Phase

The next phase should design reviewed staging callback/JWKS fetch wiring, still without enabling production writes.
