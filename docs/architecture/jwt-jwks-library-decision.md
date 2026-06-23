# JWT/JWKS Library Decision

Status: Accepted
Date: 2026-06-23

## Decision

Use `jose` for Microsoft Entra JWT/JWKS verification.

Phase 4G adds the dependency and a non-live adapter skeleton. The adapter verifies fake/local RS256 tokens with injected JWK material only. It is not wired to live routes and does not fetch Microsoft JWKS metadata.

## Options Compared

## `jose`

- Standards support: strong JOSE/JWT/JWK support.
- JWK/JWKS support: first-class JWK import and JWT verification.
- TypeScript fit: native TypeScript-friendly API.
- Node/Next.js fit: suitable for modern JavaScript runtimes used by Next.js.
- Security posture: avoids custom crypto and supports explicit issuer, audience and algorithm checks.
- Maintenance risk: lower than stitching multiple small packages together.
- Complexity: one focused dependency.
- Policy enforcement: supports issuer, audience and algorithm checks; code enforces `kid`, tenant and nonce.
- Testability: supports local generated key pairs and fake signed tokens.

## `jsonwebtoken` Plus `jwks-rsa`

- Standards support: common JWT verification library, usually paired with a JWKS helper.
- JWK/JWKS support: requires additional package or custom glue.
- TypeScript fit: acceptable but more fragmented.
- Node/Next.js fit: usable in Node-oriented code.
- Security posture: workable, but multi-package composition increases configuration risk.
- Maintenance risk: more moving parts.
- Complexity: higher for Entra key selection, caching and tests.
- Policy enforcement: possible but split across libraries and local code.
- Testability: possible with more setup.

## Microsoft-Specific SDK

- Standards support: provider-specific rather than general JOSE boundary.
- JWK/JWKS support: may be hidden behind SDK abstractions.
- TypeScript fit: varies by package.
- Node/Next.js fit: may pull broader Microsoft platform dependencies.
- Security posture: acceptable for some flows but less direct for local JWT verification boundaries.
- Maintenance risk: tied to SDK scope and auth-flow assumptions.
- Complexity: likely too broad for this narrow verifier boundary.
- Policy enforcement: may obscure explicit algorithm/key-selection rules.
- Testability: less focused for fake/local key tests.

## Custom / Manual Verification

Rejected.

Manual cryptographic verification would be high risk, hard to review and unnecessary when mature JOSE libraries exist. Burgess auth must avoid custom crypto.

## Consequences

- `jose` is added to production dependencies.
- Live auth still requires a reviewed callback/session phase.
- JWKS network fetching remains disabled until a future staging phase.
- Routes remain disabled.
- Production auth readiness remains false.
- Production writes remain blocked.
