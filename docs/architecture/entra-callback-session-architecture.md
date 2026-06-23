# Entra Callback And Session Architecture

Status: Phase 4G jose verifier decision
Date: 2026-06-23

Phase 4B adds disabled route placeholders. It does not implement live OAuth, token exchange, session creation or cookie writing.

Phase 4C adds pure state/nonce, PKCE, JWKS descriptor and token-validation skeletons. It still does not redirect to Microsoft, fetch JWKS metadata, exchange tokens, create sessions or authenticate users.

Phase 4D adds an OAuth state store boundary and JWKS metadata cache boundary. The adapters are test/in-memory only and are not wired to live routes, cookies, sessions or default network fetches.

Phase 4E adds disabled-by-default staging dependency wiring for the state store, JWKS cache, PKCE helpers and token-validation marker. The wiring is not imported by live route handlers and does not enable redirects, token exchange, cookies, sessions, production auth readiness or writes.

Phase 4F adds JWT/JWKS key-selection and verifier boundaries. There is no default verifier and no live JWT library yet; decoded claims do not authenticate users without an injected verifier result.

Phase 4G selects `jose` and adds a non-live verifier adapter for injected JWK material and fake/local tests. Routes remain disabled and still do not exchange codes, fetch JWKS metadata, create sessions or create cookies.

## Intended Login Flow

1. User opens a future `/api/auth/entra/login` route.
2. The app generates state, nonce and CSRF metadata.
3. The app stores transient metadata in a secure, HTTP-only, same-site cookie or reviewed server-side store.
4. The app redirects to the Microsoft Entra authorization endpoint.
5. Microsoft returns the user to `/api/auth/entra/callback`.

In Phase 4B, the login route returns disabled JSON and does not redirect.

## Callback Flow

1. Validate `state` and CSRF metadata.
2. Validate nonce binding.
3. Exchange authorization code for tokens.
4. Validate ID token signature, issuer, audience, expiry and nonce.
5. Map claims through the Entra claim mapper.
6. Create a reviewed server session.
7. Audit successful login or failed login.

In Phase 4B, the callback route returns disabled JSON and does not exchange tokens.

## State, Nonce And CSRF

- State must be random, short-lived and single-use.
- Nonce must bind the browser flow to the returned ID token.
- Browser-submitted callbacks must validate CSRF metadata.
- Missing or mismatched state/nonce must fail closed and produce a failed-login audit event in a future implementation.
- Phase 4C helpers validate state/nonce shape, expiry, provider marker and redirect allowlist only; storage is still a future phase.
- Phase 4D state store models one-time consume behavior and expiry. Live cookie/server-side storage remains a future reviewed implementation.
- Phase 4E can compose the state store behind an explicit staging flag, but route placeholders still do not store browser state.

## Token Validation Requirements

- Fetch and cache Microsoft OpenID metadata through reviewed code only.
- Validate issuer against the configured tenant.
- Validate audience against the configured client ID.
- Validate signature using Microsoft JWKS.
- Validate expiry and not-before claims.
- Reject tokens from unexpected tenants or domains.
- Never log tokens or client secrets.
- Phase 4C token validation checks expected claim shape but always fails with cryptographic verification required for otherwise complete tokens.
- Phase 4D JWKS cache models metadata availability and expiry through an injectable fetcher. No default Microsoft network call exists.
- Phase 4E can compose the JWKS cache dependency, but cryptographic token verification remains unavailable and tokens still do not authenticate users.
- Phase 4G selects `jose` for the verifier dependency. Live callback code must still wait for reviewed JWKS fetch/cache wiring and staging validation.

## Claim Mapping

- Subject claim maps to internal user ID.
- Email or preferred username maps to email after domain allowlist checks.
- Display name remains optional.
- Role claim must map to an explicit Burgess role key.
- Unknown, missing or duplicated role claims fail closed.

## Future Session Object Shape

- `userId`
- `email`
- `displayName`
- `roleKey`
- `provider`
- `issuedAt`
- `expiresAt`

Phase 4B adds validation for this shape but does not create sessions.

## Secure Cookie Requirements

- HTTP-only.
- Secure in staging/production.
- SameSite reviewed before deployment.
- Short-lived.
- Path and domain scoped narrowly.
- No token or secret value stored directly in the browser.

## Expiry And Refresh Policy

- Sessions must expire.
- Refresh behavior must be reviewed before implementation.
- Revoked users must lose access promptly.
- Owner/principal and support admin sessions should use conservative lifetimes.

## Logout Behavior

- Future logout should clear the app session.
- Future logout may redirect to Microsoft logout only after review.
- Logout should produce an audit event.

In Phase 4B, the logout route returns disabled JSON and does not mutate cookies.

## Failure Modes

- Missing config.
- Disabled production auth readiness.
- Missing state, nonce or code.
- Token exchange failure.
- Invalid signature, issuer, audience or expiry.
- Missing email, subject or role.
- Disallowed domain.
- Unknown role.
- Session creation failure.

All failure modes must return safe errors and avoid exposing secrets or raw tokens.

## Audit Events

Future live auth should emit:

- `login`
- `failed_login`
- `logout`

Audit metadata must not include tokens, secrets or raw provider payloads.

## Why Routes Remain Disabled

The route placeholders exist so routing, tests and guardrails can be reviewed before live auth. They remain disabled even when staging dependency wiring and verifier boundaries are available, and stay disabled until Entra app registration, secret storage, callback/session implementation, staging validation, cryptographic token verification and production readiness review are complete.
