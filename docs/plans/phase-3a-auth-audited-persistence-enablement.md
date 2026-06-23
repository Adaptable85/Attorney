# Phase 3A Auth And Audited Persistence Enablement

Status: Complete
Date: 2026-06-23

## Summary

Create the production-grade auth boundary and audited persistence enablement layer required before disabled forms or read-only placeholders become real operational workflows.

This phase hardens session-to-role mapping, adds fail-closed admin user helpers, introduces service context and audited mutation execution, and routes client/matter create service preparation through audit-first service wrappers. It does not enable live UI saves or production persistence.

## Scope

- Harden role mapping from authenticated session claims into domain roles.
- Add a future-provider-compatible session auth provider boundary without real secrets.
- Keep local/dev current user explicitly dev-only and fail-closed for unknown roles.
- Add a `requireAdminUser` helper for server-side access checks.
- Add service context with actor, primary role, source and audit writer.
- Add audited mutation execution that requires permission and audit metadata before running mutation preparation.
- Update client/matter create service functions to require audited service context.
- Keep create forms disabled and future-phase labelled.
- Add guardrail tests for forbidden cross-repo references, hard-delete naming, disabled forms and audited mutation requirements.

## Non-Goals

- No production auth provider setup.
- No production secrets.
- No live client/matter save from UI.
- No API route mutation handlers.
- No server actions that write data.
- No production database commands.
- No `db:push`.
- No production migrations.
- No invoice or statement workflows.
- No PDF generation.
- No email or WhatsApp sending.
- No Lexpro import/sync.
- No payment reconciliation.
- No website, marketing or outreach implementation.

## Assumptions

- Production auth provider selection remains unresolved.
- Future production auth will provide a stable subject, email and role claim set that can be mapped through `src/auth/role-mapping.ts`.
- Normal validation must remain database-free.
- Client/matter create forms remain disabled until audited persistence is explicitly enabled in a later phase.
- Repository adapters may be expanded later behind DB-specific tests, but Phase 3A stays service-boundary focused.

## Risks

- Future auth integration may need provider-specific session fields.
- Recording audit before a repository write is safe for this enablement layer, but future real persistence should use transactions or an outbox-style pattern when available.
- Existing repository interfaces still need concrete client/matter Prisma adapters before live persistence can be enabled.
- Disabled form pages can be mistaken for live flows if labels are removed.

## Implementation Steps

1. Confirm clean Attorney repo state.
2. Add Phase 3A plan.
3. Add session and role mapping helpers.
4. Update current-user dev helper to fail closed for unknown roles.
5. Add server-side admin user requirement helper.
6. Add service context and audited mutation executor.
7. Update client/matter create services to require audited service context.
8. Add tests for auth mapping, service context, audited service behavior and client/matter create auditing.
9. Add architecture guardrails.
10. Update docs/context.
11. Run deterministic validation.
12. Commit Phase 3A.

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
- `pnpm run test:db` only when local `DATABASE_URL` is available.

## Rollback / Recovery

Revert the Phase 3A commit to remove the hardened auth/session helpers, service context, audited mutation executor, client/matter audited create changes, guardrail tests and documentation updates. No production data or schema changes are expected.

## Acceptance Criteria

- Missing user fails closed.
- Unknown role fails closed.
- Owner/support/agent/read-only session roles map explicitly into domain roles.
- Agent service users remain blocked from normal admin shell.
- Read-only reviewer remains limited.
- Dev current user helper is clearly local/dev and requires supported role keys.
- No auth helper requires production secrets in normal tests.
- Service context requires actor and role.
- Permission denied returns a safe typed error.
- Mutation-capable service actions require audit metadata.
- Successful client/matter create preparation emits audit payloads.
- Raw repository errors are not exposed as user-facing service errors.
- Client/matter create forms remain disabled.
- No delete routes or hard-delete service names are introduced.

## Open Questions

- Which production auth provider will be selected?
- What exact production role claim names will be emitted by the provider?
- Should audit and write persistence be wrapped in a database transaction or outbox pattern?
- Which concrete client/matter Prisma repository adapters should be implemented first?
- What review checklist is required before enabling live form saves?
