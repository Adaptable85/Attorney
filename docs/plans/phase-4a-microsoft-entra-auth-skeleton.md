# Phase 4A: Microsoft Entra Auth Skeleton

Date: 2026-06-23

## Summary

Add a Microsoft Entra ID / Microsoft 365 auth skeleton behind the existing production-auth boundary. This phase creates typed configuration parsing, issuer helpers, claim mapping and adapter readiness checks without live OAuth, session creation, secrets, UI saves or production writes.

## Scope

- Parse placeholder-safe Entra environment configuration.
- Build Entra issuer and OpenID configuration URLs without network calls.
- Map Entra-like claims into internal production principals.
- Add an Entra adapter skeleton that fails closed until configuration and production readiness are explicitly present.
- Add fail-closed tests and guardrails.
- Update placeholder-only `.env.example` entries and affected docs/context.

## Non-Goals

- No live Entra login.
- No OAuth token exchange.
- No cookie or session creation.
- No real tenant ID, client ID or client secret.
- No production auth readiness enablement.
- No UI save enablement.
- No production writes.
- No deployment, database push or migration.

## Assumptions

- Burgess will provide Microsoft 365 tenant/admin access in a later phase.
- The Entra app registration, redirect URI, role claim and allowed domains are not yet approved.
- Existing provider-neutral production auth and release-gate boundaries remain authoritative.
- Tests use placeholder-only values.

## Risks

- A future implementation could confuse config completeness with production readiness.
- Role claims may differ from the final Entra app registration design.
- Tenant/admin access and MFA policy still need owner confirmation.
- Callback and session security still require a separate reviewed implementation phase.

## Implementation Steps

1. Add Entra config parser and fail-closed tests.
2. Add Entra issuer/metadata helpers and tests.
3. Add Entra claim mapper and role/tenant/domain tests.
4. Add Entra adapter skeleton and tests.
5. Add placeholder-only `.env.example` entries.
6. Update docs and context with Phase 4A boundaries.
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

- Revert the Phase 4A commit.
- Remove Entra placeholder environment variables from local/dev environments if needed.
- Keep production auth readiness and production write flags disabled.
- Rotate any secret that was accidentally placed outside the approved secret store.

## Acceptance Criteria

- Entra config parser fails closed for missing or invalid required values.
- Client secret value is never returned or printed.
- `AUTH_PROVIDER=entra` alone does not enable readiness.
- Issuer helpers perform no network calls.
- Claims map only through explicit Burgess role keys.
- Unknown role, wrong tenant, missing subject and missing email fail closed.
- Adapter skeleton exposes config/readiness state but performs no live login.
- Production writes remain blocked by release gates.
- `.env.example` contains placeholders only.

## Open Questions

- Which Burgess tenant ID and app registration will be used for staging?
- Which Entra claim will carry Burgess role keys?
- Which email domains and explicit users are allowed?
- What MFA and break-glass policies will be approved?
- When should live OAuth callback/session handling be implemented?

