# 0008: Use jose For Entra JWT Verification

Status: Accepted
Date: 2026-06-23

## Context

Burgess Attorneys production auth will use Microsoft Entra ID. Entra ID tokens must be cryptographically verified before claims can become an authenticated principal. The project needs a standards-based JWT/JWK implementation without custom crypto or live route enablement.

## Decision

Use `jose` for Microsoft Entra JWT/JWKS verification.

## Consequences

- `jose` is added as a dependency.
- Verification code must still fail closed when keys, issuer, audience, tenant, nonce, expiry or algorithm checks fail.
- JWKS fetching remains disabled until a reviewed staging phase.
- Entra routes remain disabled until live callback/session work is approved.
- Production auth readiness and production writes remain disabled.
