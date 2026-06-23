# Entra JWT/JWKS Verification Design

Status: Phase 4H staging callback/JWKS fetch-cache design
Date: 2026-06-23

Phase 4F added a verification boundary only. Phase 4G selects `jose` and adds a non-live adapter skeleton for fake/local token verification. It does not add live OAuth, token exchange, Microsoft network fetches, sessions, cookies, production auth readiness or writes.

Phase 4H documents how a future staging callback should fetch and cache JWKS metadata before passing selected JWK material to the `jose` adapter. It does not implement that fetch/cache wiring or enable routes.

## Why Cryptographic Verification Is Required

Microsoft Entra ID tokens contain claims that would become identity and role inputs in a future live login flow. Those claims must not be trusted until the JWT signature, issuer, audience, tenant, expiry and nonce are verified.

Decode-only parsing is not authentication.

## Library Decision

Phase 4G selects `jose` and records ADR 0008. `jose` provides standards-based JWT/JWK verification without custom crypto.

The current adapter uses injected JWK material and fake/local signed tokens only. It does not fetch Microsoft JWKS metadata and is not wired to routes.

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

Phase 4D introduced a JWKS cache boundary with injectable fetcher. Phase 4H defines the intended expiry, rotation, unknown-`kid` refresh and outage behavior in `docs/architecture/entra-staging-callback-jwks-fetch-cache-design.md`. Future live auth must implement and validate that design before routes are enabled.

## Route Status

Login, callback and logout routes remain disabled. They do not redirect to Microsoft, exchange tokens, create cookies, create sessions, fetch JWKS metadata or authenticate users.

## Requirements Before Live Auth

- Define reviewed live JWKS fetch/cache behavior.
- Implement and test the Phase 4H staging callback/JWKS fetch-cache design.
- Configure real Entra app registration values outside Git.
- Validate JWKS fetch/cache behavior in staging.
- Add callback/session implementation with audit events.
- Complete production readiness review.
- Keep production writes disabled until auth, audit, transaction and release gates pass.
