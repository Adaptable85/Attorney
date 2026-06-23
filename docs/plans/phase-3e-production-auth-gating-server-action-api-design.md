# Phase 3E Production Auth Gating And Server-Action/API Design

Status: Implemented for review
Date: 2026-06-23

## Summary

Phase 3E adds the design pack and tested release/mutation gates required before any future server action or API mutation route can write client/matter data. It does not enable live saves, server actions, route handlers or production database operations.

## Scope

- Add production auth design documentation.
- Add mutation entrypoint design documentation.
- Add feature flag and release gate helpers.
- Add mutation gate helper for future server actions/API handlers.
- Add tests proving gates fail closed and roles remain constrained.
- Keep create forms disabled and not wired to the gate.
- Update guardrails and context docs.

## Non-Goals

- No live UI save.
- No active server action or API mutation route.
- No production auth provider integration.
- No production database operation.
- No production migration.
- No deploy.
- No `db:push`.
- No invoice, statement, PDF, email, WhatsApp, Lexpro, payment reconciliation, website, marketing or outreach behavior.
- No hard-delete methods.

## Assumptions

- Production auth provider is not selected yet.
- Future mutation entrypoints must use service-layer logic, not UI-owned business logic.
- Client/matter writes remain disabled by default.
- Release gates must fail closed on missing or unknown config.
- Server actions/API routes should be added only in a later accepted phase.

## Risks

- Provider choice remains pending, so production auth cannot yet be fully validated.
- Feature flags are only gates; they do not replace permission checks, audit metadata or transaction boundaries.
- Route/action implementation still needs a future security review.

## Implementation Steps

1. Document production auth requirements and provider options.
2. Document server action/API route trade-offs and required mutation checklist.
3. Add default-off feature flags and release gate helpers.
4. Add mutation gate helper requiring principal, release gate, service context, permission, audit metadata and transaction boundary.
5. Add unit tests for fail-closed behavior.
6. Keep create forms disabled and update copy.
7. Extend architecture guardrails.
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

Run DB validation only when `DATABASE_URL` is set and the guard accepts it as local/dev.

## Rollback / Recovery

- Revert the Phase 3E commit to remove design docs and gate helpers.
- No schema changes, migrations, live routes or live writes are part of this phase.
- No production data is touched.

## Acceptance Criteria

- Write gates default off.
- Unknown or missing flag values fail closed.
- Production writes require production auth configured, audited persistence and explicit client/matter write flag.
- Local/dev writes require explicit dev-only flag.
- Mutation gate blocks missing users, agent users, read-only users, missing service context, missing audit metadata, missing transaction boundary and disabled release gates.
- Create forms remain disabled and do not import mutation gate, Prisma adapters or local/dev composition.
- App routes do not expose active mutation calls.

## Open Questions

- Which production auth provider will be selected?
- Will first write entrypoint use server actions, route handlers or both?
- What release approval process will flip production write gates?
