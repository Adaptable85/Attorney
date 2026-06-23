# Entra Callback And Session Architecture

Status: Phase 4B design only
Date: 2026-06-23

Phase 4B adds disabled route placeholders. It does not implement live OAuth, token exchange, session creation or cookie writing.

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

## Token Validation Requirements

- Fetch and cache Microsoft OpenID metadata through reviewed code only.
- Validate issuer against the configured tenant.
- Validate audience against the configured client ID.
- Validate signature using Microsoft JWKS.
- Validate expiry and not-before claims.
- Reject tokens from unexpected tenants or domains.
- Never log tokens or client secrets.

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

The route placeholders exist so routing, tests and guardrails can be reviewed before live auth. They remain disabled until Entra app registration, secret storage, callback/session implementation, staging validation and production readiness review are complete.

