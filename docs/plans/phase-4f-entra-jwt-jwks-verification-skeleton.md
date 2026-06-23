# Phase 4F: Entra JWT/JWKS Verification Skeleton

Status: Complete
Date: 2026-06-23

## Summary

Phase 4F adds a Microsoft Entra JWT/JWKS verification boundary skeleton. It introduces key-selection rules, an algorithm allowlist and an injected signature-verifier dependency so ID token claims can only pass validation after a verifier boundary reports success.

No JWT library is added in this phase. No decode-only path authenticates users.

## Scope

- Add JWKS key selection by `kid`.
- Enforce the `RS256` algorithm allowlist.
- Add a JWT verifier boundary with no default verifier.
- Require verifier-produced claims before token validation can pass.
- Use fake/local test keys and a local test verifier only in unit tests.
- Update docs, context and guardrails.

## Non-Goals

- No live OAuth token exchange.
- No Microsoft JWKS network fetch.
- No live Microsoft redirect.
- No session cookie creation.
- No production auth readiness.
- No production writes or UI saves.
- No real tenant, client, key or secret values.

## Assumptions

- Microsoft Entra ID tokens must use reviewed asymmetric JWT verification before live login.
- The future implementation will likely use a maintained JOSE-compatible library such as `jose`, but that dependency decision remains separate.
- Current route placeholders must remain disabled until staging validation is explicitly accepted.

## Risks

- A future implementation could accidentally treat decoded claims as verified.
- Key rotation behavior still needs a reviewed live JWKS fetch/cache strategy.
- Adding a JWT library later will need separate dependency and security review.

## Implementation Steps

1. Add JWKS key-selection helper and tests.
2. Add JWT verifier boundary and tests.
3. Update token validation to require the verifier boundary for raw ID token validation.
4. Keep existing routes disabled and unwired.
5. Update architecture docs and guardrails.

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

- Revert the Phase 4F commit if the verifier boundary needs removal.
- Keep Entra routes disabled.
- Keep production auth and write flags disabled.
- Rotate any accidentally exposed secret outside Git.

## Acceptance Criteria

- Missing, malformed, unsigned, wrong-algorithm and wrong-key tokens fail closed.
- Missing, unknown, duplicate or unsupported JWKS keys fail closed.
- No verifier means raw token validation fails closed.
- Verifier failure fails closed.
- Fake/local verifier-produced claims can pass structural validation.
- Raw token values are not exposed in errors.
- Routes remain disabled and unwired from live auth.

## Open Questions

- Which JOSE-compatible library will be accepted for production signature validation?
- What JWKS refresh, cache expiry and key-rotation policy will be approved?
- What staging callback/session audit events will be required before live auth?
