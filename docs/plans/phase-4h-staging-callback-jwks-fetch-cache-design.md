# Phase 4H Plan: Staging Callback And JWKS Fetch-Cache Design

Status: planned/implemented as documentation only
Date: 2026-06-23

## Goal

Prepare the reviewed design, safety checklist and validation plan for a future Microsoft Entra staging callback flow with JWKS fetch/cache behavior.

Phase 4H does not implement live login, Microsoft redirects, token exchange, session cookies, default network fetches, production auth readiness, UI saves or production writes.

## Scope

- Document the intended real callback sequence.
- Document state, nonce and PKCE validation order.
- Document JWKS metadata fetch, cache expiry and rotation behavior.
- Document how the existing `jose` verifier adapter should be wired in a later implementation phase.
- Document fail-closed behavior, audit events, staging validation and rollback.
- Update architecture/context files to reflect that this is a design-only phase.

## Non-Scope

- No route enablement.
- No Microsoft network calls.
- No token exchange.
- No session cookie creation.
- No production readiness flag changes.
- No UI save behavior.
- No production writes.
- No database schema or migration work.
- No secrets.

## Acceptance Criteria

- `docs/architecture/entra-staging-callback-jwks-fetch-cache-design.md` captures callback, state/nonce, PKCE, JWKS cache, `jose`, audit, staging, production readiness, rollback and security review requirements.
- Existing Entra architecture docs point to the Phase 4H design without implying live readiness.
- Context and repo instructions state that callback/JWKS fetch-cache work remains disabled and documentation-only.
- Deterministic validation passes.

## Validation Commands

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

DB tests are not part of this phase unless local PostgreSQL is available and explicitly requested.
