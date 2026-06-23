# Phase 3F Production Auth Adapter Boundary And Disabled Mutation Entrypoints

Status: Implemented for review
Date: 2026-06-23

## Summary

Phase 3F adds a provider-neutral production auth adapter boundary, production auth readiness checks and disabled client/matter mutation entrypoint skeletons. The skeletons evaluate the mutation gate but still return disabled results and do not write.

## Scope

- Add production auth config/readiness helpers.
- Add provider-neutral production auth claim mapping.
- Add tests for fail-closed auth mapping and readiness.
- Add disabled client/matter mutation entrypoint skeletons.
- Add tests proving skeletons fail closed and remain non-writing.
- Keep create forms disabled and not wired to skeletons.
- Update guardrails and context docs.

## Non-Goals

- No real auth provider setup.
- No provider secrets.
- No live UI save.
- No active server action or API mutation route.
- No production database write.
- No production migration.
- No deploy.
- No `db:push`.
- No invoice, statement, PDF, email, WhatsApp, Lexpro, payment reconciliation, website, marketing or outreach behavior.
- No hard-delete methods.

## Assumptions

- Production auth provider remains undecided.
- Local/dev auth remains separate from production auth readiness.
- Future mutation entrypoints should use server/service modules before any UI wiring.
- Disabled skeletons are useful now because they make future write preconditions testable without enabling writes.

## Risks

- Provider-specific claim shapes still need review once a provider is selected.
- Disabled skeletons must not be mistaken for live server actions.
- Future live writes still need security review and release approval.

## Implementation Steps

1. Document the Phase 3F plan.
2. Add production auth provider config and readiness helpers.
3. Add provider-neutral production auth claim mapper and adapter contract.
4. Add disabled client/matter mutation skeletons under server modules.
5. Keep skeletons unwired from UI and app routes.
6. Update form copy while keeping controls disabled.
7. Extend guardrail tests.
8. Update docs/context.

## Validation

Required normal validation:

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

DB validation:

```sh
pnpm run test:db
```

Run DB validation only when `DATABASE_URL` is set and accepted as local/dev.

## Rollback / Recovery

- Revert the Phase 3F commit.
- No schema changes, migrations, live routes, live actions or live writes are part of this phase.
- No production data is touched.

## Acceptance Criteria

- Production auth readiness defaults false.
- Unknown production auth provider values fail closed.
- Local/dev auth does not count as production auth readiness.
- Production auth claims fail closed for missing subject, email or role.
- Unknown role claims fail closed.
- Agent role maps but does not receive client/matter write permission.
- Disabled mutation skeletons pass through the mutation gate.
- Owner/support attempts remain disabled when live write gates are off.
- Skeletons do not call repositories or Prisma adapters.
- Create forms remain disabled and unwired.

## Open Questions

- Which production auth provider will be selected?
- Which claim names will the selected provider emit for Burgess roles?
- What staging release process will approve the first dev-only write test?
- What owner/principal approval record is required before production writes?
