# Phase 4D: Entra OAuth Storage And JWKS Cache Design

Date: 2026-06-23

## Summary

Add safe storage-boundary abstractions for OAuth state/nonce and a reviewed JWKS metadata cache design. This phase keeps Entra auth non-live: no Microsoft redirects, no token exchange, no JWKS network fetch by default, no cookies, no sessions and no production writes.

## Scope

- OAuth state store interface and in-memory test adapter.
- One-time state consume semantics for replay prevention.
- Expiry and provider validation for stored OAuth state.
- JWKS metadata cache interface and in-memory test cache.
- Injectable JWKS fetcher interface with no default network fetch.
- Token-validation skeleton requiring JWKS metadata while still failing until cryptographic verification exists.
- Docs/context updates and guardrails.

## Non-Goals

- No live OAuth token exchange.
- No network calls to Microsoft in normal code/tests.
- No Microsoft redirect.
- No session cookie creation.
- No production auth readiness enablement.
- No real tenant, client or secret values.
- No UI save enablement.
- No production writes, deployment, database push or migration.

## Assumptions

- State/nonce storage will later use reviewed secure cookies or a reviewed server-side store.
- JWKS fetching and caching need a separate reviewed implementation phase.
- Token claim-shape checks are not authentication.
- Route placeholders remain disabled.

## Risks

- In-memory adapters are test-only and not durable.
- A future implementation could accidentally fetch JWKS on every request without cache controls.
- State storage must remain one-time-use to prevent replay.
- Token validation must not produce principals before cryptographic verification is implemented.

## Implementation Steps

1. Add OAuth state store boundary and in-memory adapter.
2. Add tests for one-time consume, expiry, missing/malformed state and no DB dependency.
3. Add JWKS cache boundary and injectable fetcher.
4. Add tests for missing/expired/wrong-issuer JWKS metadata and no default network call.
5. Update token validation skeleton to require JWKS metadata while still failing closed.
6. Add storage/cookie design document.
7. Update context, docs and guardrails.
8. Run deterministic validation.

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

- Revert the Phase 4D commit.
- Confirm Entra routes still return disabled JSON.
- Keep production auth readiness and production write flags disabled.
- Remove any later state/JWKS storage wiring if partially applied.

## Acceptance Criteria

- Stored OAuth state can be consumed once.
- Replay consumption fails.
- Expired, missing, malformed and mismatched state fails closed.
- State store requires no DB and no cookies.
- JWKS cache fails closed for missing, expired or wrong-issuer metadata.
- JWKS cache uses an injected fetcher only and makes no network call by default.
- Token validation requires JWKS metadata and still fails with cryptographic verification required.
- Routes remain disabled and do not use the store/cache live.

## Open Questions

- Should live state storage use secure cookies, server-side storage or both?
- What JWKS fetch/cache TTL should be approved?
- Which JWT/JWKS verification library should be approved?
- How will JWKS refresh failures be monitored in staging?

