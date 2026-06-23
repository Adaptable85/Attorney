# Phase 4C: Entra OAuth Security Skeleton

Date: 2026-06-23

## Summary

Add Microsoft Entra OAuth security primitives for future live auth. This phase creates state/nonce helpers, PKCE helpers, JWKS URL descriptors and token-validation skeletons while keeping all auth routes disabled.

## Scope

- State and nonce payload creation/validation.
- Redirect target allowlist checks.
- PKCE verifier/challenge helpers.
- Entra token validation skeleton for issuer, audience, tenant, expiry, nonce, subject, email and domain checks.
- JWKS descriptor construction without network calls.
- Tests and guardrails for fail-closed behavior.
- Docs/context updates.

## Non-Goals

- No live OAuth token exchange.
- No network calls to Microsoft.
- No redirect to Microsoft.
- No JWT signature verification yet.
- No session cookie creation.
- No production auth readiness enablement.
- No UI save enablement.
- No production writes, deployment, database push or migration.

## Assumptions

- Final staging tenant/app registration values are still pending.
- Real JWT verification will require reviewed JWKS fetch/cache behavior.
- State/nonce storage will be implemented in a later phase using secure cookies or a reviewed server-side store.
- Current route placeholders remain intentionally disabled.

## Risks

- Future work could treat claim-shape validation as cryptographic token validation.
- Incorrect state/nonce storage could weaken CSRF protection.
- PKCE verifier handling must avoid logging or persistence mistakes in a live phase.
- JWKS fetch/cache behavior still needs security review.

## Implementation Steps

1. Add OAuth state/nonce helpers and tests.
2. Add PKCE helper and tests.
3. Add Entra token-validation skeleton and tests.
4. Add JWKS descriptor helper and tests.
5. Confirm auth routes remain disabled.
6. Update docs/context and guardrails.
7. Run deterministic validation.

## Validation

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm test`
- `pnpm run test:coverage`
- `pnpm run prisma:validate`
- `pnpm run build`
- `./scripts/check-agent-context.sh`
- `./scripts/check-adr-needed.sh`
- `./scripts/pre-pr-review.sh`

DB-only tests remain out of scope unless a safe local PostgreSQL database is available.

## Rollback / Recovery

- Revert the Phase 4C commit.
- Confirm Entra routes still return disabled JSON.
- Keep production auth readiness and production write flags disabled.
- Remove any future OAuth state storage if later phases partially apply it.

## Acceptance Criteria

- Valid state/nonce payloads validate.
- Expired, malformed, wrong-provider and unsafe-redirect state fails closed.
- PKCE challenge generation is deterministic for controlled input.
- Invalid PKCE verifiers fail closed.
- Token skeleton rejects missing issuer, wrong issuer, wrong audience, expired token, wrong nonce, missing subject/email and disallowed domains.
- Complete placeholder tokens still fail with cryptographic verification required.
- JWKS helper constructs URLs without network calls.
- Routes still do not redirect, exchange tokens or create cookies.

## Open Questions

- Where will state and nonce be stored for the live flow?
- What JWKS fetch/cache library or implementation will be approved?
- What session lifetime and refresh policy will be accepted?
- How will login/failure/logout audit events be persisted in staging?

