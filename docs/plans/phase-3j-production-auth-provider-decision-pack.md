# Phase 3J Production Auth Provider Decision Pack

Status: Implemented for review
Date: 2026-06-23

## Summary

Phase 3J creates the production auth provider decision pack for Burgess Attorneys. It compares provider routes, recommends a pending owner-approved direction and documents the implementation, environment, security, testing and rollback plan before production auth readiness or production writes can be enabled.

## Scope

- Document production auth requirements for the legal-admin platform.
- Compare Auth.js, Clerk, Supabase Auth, Microsoft Entra ID and Auth0-style providers.
- Recommend a provider direction pending owner approval.
- Document phased implementation plan.
- Document environment variable placeholders with no secrets.
- Document role/claim mapping, MFA, session and rollback requirements.
- Update affected docs/context.

## Non-Goals

- No real auth provider integration.
- No production auth secrets.
- No production login flow.
- No UI save enablement.
- No server action or API mutation writes.
- No production database commands.
- No deploy.
- No `db:push`.
- No production migration.
- No invoice, statement, PDF, email, WhatsApp, Lexpro, payment reconciliation, website, marketing or outreach behavior.

## Assumptions

- Burgess Attorneys may already use or may adopt Microsoft 365 identity.
- Production auth provider choice needs owner/principal approval before implementation.
- Current production auth readiness helpers remain fail-closed until a provider is configured and explicitly enabled.
- Live persistence remains blocked until production auth, audit, transaction and release gates are accepted.

## Risks

- Choosing a provider before confirming Burgess Attorneys' Microsoft 365 tenant status may add avoidable operational burden.
- A managed provider may reduce implementation risk but introduce vendor lock-in and recurring cost.
- Fully self-managed auth creates higher security and maintenance risk for a small legal practice.
- Role claims must be reviewed carefully so support/admin/agent users do not receive owner powers.

## Implementation Steps

1. Review existing auth readiness and production auth adapter boundaries.
2. Compare provider options against Burgess legal-admin requirements.
3. Document recommendation pending owner approval.
4. Document phased implementation plan.
5. Document environment variable placeholders.
6. Document security, testing and rollback checklists.
7. Update docs/context.
8. Run deterministic validation.

## Validation

Required validation:

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

DB-only validation remains optional and requires local PostgreSQL.

## Rollback / Recovery

- Revert the Phase 3J commit to remove decision-pack documentation.
- No runtime behavior, secrets, schema, routes or production writes are changed.
- Production auth readiness and write gates remain disabled.

## Acceptance Criteria

- Decision pack exists.
- Provider options are compared against legal-admin requirements.
- Recommendation is marked pending owner approval.
- No provider secret or integration is added.
- Production writes remain blocked.
- Create forms remain disabled.
- Existing validation passes.

## Open Questions

- Does Burgess Attorneys currently use Microsoft 365 with an Entra tenant?
- Who will administer production identity and MFA?
- What role claim name should the selected provider emit?
- What break-glass process is acceptable for owner lockout recovery?
