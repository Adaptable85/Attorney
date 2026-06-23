# Testing And Quality

## Required Standards

- TDD first for business logic.
- Auth, permissions, financial records, approval gates, document access, data mutations and agent actions are critical paths.
- Aim for 90%+ code coverage.
- Critical paths should have 100% practical coverage.
- No lint errors.
- No disabled linting.
- No skipped tests without explicit justification.
- Every feature must include tests before completion.
- Every future phase must include acceptance criteria and validation commands.

## Current Validation State

Phase 0 defines real package validation commands.

Run:

```sh
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run build
pnpm run pre-pr
```

`scripts/pre-pr-review.sh` also runs context checks and available package checks.

Phase 1A critical-path tests cover:

- Role permission invariants.
- Agent draft-only restrictions.
- Support-admin approval restrictions.
- Read-only reviewer restrictions.
- Audit event sensitivity.
- Auth provider boundary.
- Architecture guardrails.

Phase 1B critical-path tests cover:

- Client creation validation.
- Matter creation validation.
- Client/matter edit permission boundaries.
- Document metadata private defaults.
- Document access/download permission boundaries.
- Timeline event payload shape.
- Client/matter/document/timeline audit event coverage.
- DocumentRecord metadata-only schema guardrail.

Phase 1C critical-path tests cover:

- Integer-cent money validation.
- VAT defaults and override reason requirements.
- Draft invoice number boundaries.
- Owner-only invoice/statement approval.
- Invoice number assignment on owner approval.
- Financial correction payloads.
- Financial audit event sensitivity.
- Prisma money-field guardrails.

Phase 1D critical-path tests cover:

- Repository interfaces avoiding hard-delete methods.
- Approved invoice/statement repository updates routed through correction workflows.
- Fake fixtures including all day-one roles.
- Fake financial fixtures using integer cents.
- Prisma client boundary import without `DATABASE_URL`.
- Dev-only seed guardrails.
- Migration strategy warning against automatic production migrations by agents.

Phase 3A critical-path tests cover:

- Fail-closed session-to-role mapping.
- Local/dev current-user boundary with no production secrets.
- Server-side admin user requirement helper.
- Service context actor and role requirements.
- Audited mutation permission and audit metadata requirements.
- Client/matter create services requesting audit payloads before repository writes.
- Guardrails against forbidden cross-repo references, hard-delete names and active client/matter workflow controls.

Phase 3B critical-path tests cover:

- Local-only Prisma client repository adapter create/read/list behavior.
- Local-only Prisma matter repository adapter create/read/list/update behavior.
- DB integration tests guarded to local `burgess_attorneys_dev`.
- Service create paths proving permission denial, validation failure and audit failure prevent repository writes.
- Guardrails preventing direct UI Prisma/repository-adapter use and normal-test database requirements.

Phase 3C critical-path tests cover:

- Audited mutation requirements for actor context, permission decision and audit metadata.
- Audit, repository and transaction failure paths returning safe typed errors.
- Fake transaction boundary commit and rollback behavior in normal tests.
- Client/matter create service preparation running through an injected transaction boundary.
- Guarded Prisma transaction DB tests for atomic fake client plus audit-log behavior.
- Guardrails preventing direct UI transaction-boundary imports.

Phase 3D critical-path tests cover:

- Prisma AuditLog repository mapping.
- Local/dev service composition fail-closed behavior.
- Composed backend client/matter create dependencies using transaction-scoped repositories.
- Guarded DB-only composition tests for owner/support success and agent/reviewer denial.
- Guardrails preventing app/UI imports of local/dev composition.

Phase 3E critical-path tests cover:

- Feature flags defaulting off and failing closed for unknown values.
- Production client/matter writes requiring production auth readiness and audited persistence readiness.
- Local/dev writes requiring explicit local/dev write enablement.
- Mutation gate denial for disabled release gates, missing users, agent users, read-only users, missing service context, missing audit metadata and missing transaction boundary.
- Guardrails preventing create forms or app routes from importing active mutation gates as live save paths.

Phase 3F critical-path tests cover:

- Production auth readiness defaulting false.
- Unknown and local/dev provider values failing closed.
- Provider claims mapping only through explicit internal role keys.
- Missing subject, email or role claims failing closed.
- Agent role mapping without client/matter write permission.
- Disabled client/matter mutation skeletons failing closed for missing users, blocked roles, disabled gates, missing audit metadata and missing transaction dependency.
- Guardrails preventing mutation entrypoints from importing Prisma adapters or active server action markers.

Phase 3G critical-path tests cover:

- Production and dev write gates staying separate and default-off.
- Explicit local/dev gates enabling backend mutation functions without enabling production writes.
- Owner/support dev mutations using audited service paths only when local/dev composition is provided.
- Agent/read-only users remaining blocked.
- Missing audit metadata, missing transaction dependency and disabled gates preventing repository writes.
- Real-looking account numbers rejected from the dev-only path.
- DB-only dev mutation tests guarded to safe local `burgess_attorneys_dev`.
- Guardrails keeping UI forms disabled and free of direct persistence imports.

## Future Required Checks

- Add Playwright browser tests when real UI workflows exist.
- Add security/dependency checks where practical.
- Keep coverage targets meaningful as business logic grows.
