# Phase 4E: Entra Staging Wiring For State Storage And JWKS

Status: Complete
Date: 2026-06-23

## Summary

Phase 4E adds a disabled-by-default Microsoft Entra staging wiring boundary for OAuth state storage, JWKS metadata cache dependencies, PKCE helpers and token-validation dependency markers.

The wiring exists for future staging composition only. Current Entra routes remain disabled and no live login, Microsoft redirect, token exchange, session cookie, default network fetch, production auth readiness or production write is enabled.

## Scope

- Add an explicit `entraStagingAuthWiringEnabled` feature flag.
- Add an Entra staging wiring factory that composes existing config, state store, JWKS cache, PKCE and token-validation boundaries.
- Add a disabled route dependency boundary for future handler injection.
- Prove default-off, fail-closed behavior with tests and guardrails.
- Update context and architecture notes.

## Non-Goals

- No live OAuth authorization redirect.
- No OAuth code exchange.
- No default JWKS network fetch.
- No JWT signature acceptance.
- No session or cookie creation.
- No production auth readiness.
- No production writes or UI saves.
- No real tenant, client or secret values.

## Assumptions

- Microsoft Entra ID remains the accepted production auth provider direction.
- Real cryptographic token verification is still a future dependency.
- Staging route behavior remains disabled until a later approved live-auth phase.
- Existing in-memory adapters are acceptable for non-live composition tests.

## Risks

- A future live-auth phase could accidentally treat dependency wiring as readiness.
- A future route change could import the wiring directly and bypass disabled route behavior.
- Real secrets could be pasted into local configuration if setup guidance is ignored.

## Implementation Steps

1. Add the default-off staging wiring feature flag.
2. Add the Entra staging wiring factory.
3. Add disabled route dependency composition.
4. Add tests for default-off, missing config, missing crypto dependency, secret-free output and write-gate separation.
5. Update guardrails and architecture docs.

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

- Disable `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED`.
- Revert the Phase 4E commit if wiring code needs removal.
- Keep production auth and write flags disabled.
- Rotate any accidentally exposed local-only secret outside Git.

## Acceptance Criteria

- Staging wiring is disabled by default.
- `AUTH_PROVIDER=entra` alone does not enable wiring.
- Complete placeholder config does not enable wiring unless the explicit staging flag is set.
- Missing config fails closed.
- Missing cryptographic verification dependency fails closed.
- Enabled placeholder wiring returns dependencies without live login, production readiness or writes.
- Routes remain disabled, cookie-free, redirect-free and network-free.
- No secrets are exposed in results, tests or docs.

## Open Questions

- Which reviewed JWT verification library will be accepted for live Entra ID token signature validation?
- Will future state storage use secure cookies, server-side storage or a hybrid approach?
- Which staging domain and callback URLs will be approved by the Burgess tenant administrator?
