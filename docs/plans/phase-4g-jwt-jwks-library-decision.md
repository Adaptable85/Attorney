# Phase 4G: JWT/JWKS Library Decision

Status: Complete
Date: 2026-06-23

## Summary

Phase 4G selects `jose` for Microsoft Entra JWT/JWKS verification and adds a non-live adapter skeleton that verifies fake/local RS256 tokens with injected key material only.

Routes remain disabled. No Microsoft network fetch, OAuth exchange, session cookie, production auth readiness or production write is enabled.

## Scope

- Compare JWT/JWKS library options.
- Record an ADR for the selected library.
- Add the `jose` dependency.
- Add a non-live `jose` verifier adapter skeleton.
- Test fake/local tokens and fail-closed cases.
- Update docs, context and guardrails.

## Non-Goals

- No live OAuth authorization redirect.
- No OAuth code exchange.
- No default Microsoft JWKS fetch.
- No session or cookie creation.
- No production auth readiness.
- No production writes or UI saves.
- No real tenant, client, key or secret values.

## Assumptions

- Microsoft Entra ID remains the accepted production auth provider direction.
- `jose` is appropriate for Next.js/TypeScript and avoids custom cryptography.
- Live callback/session wiring remains a future explicit phase.

## Risks

- Future code could accidentally import the adapter into disabled routes before readiness approval.
- JWKS fetch/cache policy still needs staging review.
- Real Entra tenant/app registration details are still pending.

## Implementation Steps

1. Add `jose`.
2. Document library comparison and ADR.
3. Add a non-live adapter that uses injected JWKs only.
4. Add fake/local token tests for success and fail-closed paths.
5. Update guardrails and context.
6. Run deterministic validation.

## Validation

Run:

```sh
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run prisma:validate
pnpm run build
./scripts/check-agent-context.sh
./scripts/check-adr-needed.sh
./scripts/pre-pr-review.sh
```

DB tests remain optional and require safe local PostgreSQL.

## Rollback / Recovery

- Remove `jose` from `package.json` and `pnpm-lock.yaml`.
- Remove the `entra-jose-verifier` adapter and tests.
- Revert this commit if the decision needs reconsideration.
- Keep route placeholders disabled and production auth/write flags false.

## Acceptance Criteria

- `jose` decision is documented.
- ADR 0008 records the accepted decision.
- Fake/local RS256 token verifies only with injected key material.
- Wrong issuer, audience, nonce, expiry, algorithm, malformed token and unknown kid fail closed.
- No raw token is exposed in errors.
- No Microsoft network fetch occurs.
- Existing routes remain disabled and unwired.

## Open Questions

- What reviewed JWKS cache refresh policy should staging use?
- Which staging callback domain will be registered in Entra?
- What failed-login audit event schema is required before live auth?
