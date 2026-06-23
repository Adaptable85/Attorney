# Phase 4B: Entra Staging Callback And Session Design

Date: 2026-06-23

## Summary

Prepare Microsoft Entra staging setup, callback/session architecture and disabled route boundaries. This phase keeps authentication non-live: no Microsoft redirects, no token exchange, no session cookies, no production auth readiness and no writes.

## Scope

- Add staging setup checklist.
- Add callback/session architecture document.
- Add disabled Entra login/callback/logout route placeholders.
- Add route helper functions and fail-closed tests.
- Add future session shape validation without session creation.
- Update docs, context and guardrails.

## Non-Goals

- No real tenant, client or secret values.
- No OAuth authorization-code exchange.
- No live login redirect.
- No session cookie writing.
- No production auth readiness enablement.
- No UI save enablement.
- No production writes, deployment, database push or migration.

## Assumptions

- Burgess Microsoft 365 tenant/admin access is still pending confirmation.
- Staging and production Entra app registrations will be separate.
- Role claims will use explicit Burgess role keys after review.
- Current route placeholders are intentionally inert until a live auth phase is accepted.

## Risks

- Future work could accidentally treat route existence as live auth readiness.
- Callback/session security requires careful state, nonce, CSRF and cookie design before implementation.
- Real Entra app registration values must remain outside Git.

## Implementation Steps

1. Create staging setup checklist.
2. Create callback/session architecture document.
3. Add disabled route helpers.
4. Add login/callback/logout route placeholders.
5. Add future session shape validation.
6. Add route/session/guardrail tests.
7. Update affected context and architecture docs.
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

- Revert the Phase 4B commit.
- Confirm Entra route placeholders are removed or still return disabled responses.
- Keep production auth and production write flags disabled.
- Rotate any accidentally exposed secret outside Git if needed.

## Acceptance Criteria

- Staging checklist contains no real values.
- Callback/session architecture is documented.
- Entra routes return disabled JSON responses.
- Routes do not redirect, create cookies or perform network calls.
- Session shape validates required fields and expiry without creating sessions.
- Guardrails assert no live-auth signals, secrets or cross-repo references.
- Production writes remain blocked.

## Open Questions

- Which exact staging callback URL will be registered?
- Which Entra role claim will carry Burgess role keys?
- What session lifetime and refresh policy will be approved?
- What audit sink will receive login/failure/logout events?
- Who owns break-glass admin recovery?
