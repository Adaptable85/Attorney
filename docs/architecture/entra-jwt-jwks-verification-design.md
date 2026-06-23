# Entra JWT/JWKS Verification Design

Status: Phase 4F verification skeleton
Date: 2026-06-23

Phase 4F adds a verification boundary only. It does not add live OAuth, token exchange, Microsoft network fetches, sessions, cookies, production auth readiness or writes.

## Why Cryptographic Verification Is Required

Microsoft Entra ID tokens contain claims that would become identity and role inputs in a future live login flow. Those claims must not be trusted until the JWT signature, issuer, audience, tenant, expiry and nonce are verified.

Decode-only parsing is not authentication.

## Library Decision

No JWT library is added in Phase 4F. The current implementation defines the dependency boundary and tests fail-closed behavior with fake/local keys and an injected local test verifier.

Future live implementation should evaluate a maintained JOSE-compatible library such as `jose` before accepting tokens.

## Algorithm Allowlist

- Allowed algorithm: `RS256`.
- `none`, HMAC algorithms and unsupported asymmetric algorithms fail closed.
- The JWT header algorithm must match the selected key when the key declares `alg`.

## JWKS Key Selection

- Select by `kid`.
- Missing `kid` fails closed.
- Unknown `kid` fails closed.
- Duplicate `kid` fails closed.
- Unsupported key type fails closed.
- Unsupported key use fails closed.
- No network calls occur during key selection.

## Token Validation

The verifier boundary requires:

- Raw ID token.
- Expected issuer.
- Expected audience/client ID.
- Expected tenant ID.
- Expected nonce.
- JWKS key source.
- Allowed algorithms.
- Injected signature verifier.

The boundary returns verified claims only after the signature verifier reports success. Missing verifier or verifier failure returns a safe error and does not expose the raw token.

## Issuer, Audience, Tenant And Nonce

Verified claims still must match:

- Configured issuer URL.
- Configured client ID as audience.
- Configured tenant ID.
- Expected OAuth nonce.
- Expiry and not-before windows.
- Subject and email presence.
- Allowed email domain in the higher-level token validation boundary.

## Key Caching And Rotation

Phase 4D introduced a JWKS cache boundary with injectable fetcher. Phase 4F does not add live JWKS fetching. Future live auth must define cache expiry, key rotation, retry and outage behavior before routes are enabled.

## Route Status

Login, callback and logout routes remain disabled. They do not redirect to Microsoft, exchange tokens, create cookies, create sessions, fetch JWKS metadata or authenticate users.

## Requirements Before Live Auth

- Select and review a JWT/JWKS library.
- Configure real Entra app registration values outside Git.
- Validate JWKS fetch/cache behavior in staging.
- Add callback/session implementation with audit events.
- Complete production readiness review.
- Keep production writes disabled until auth, audit, transaction and release gates pass.
