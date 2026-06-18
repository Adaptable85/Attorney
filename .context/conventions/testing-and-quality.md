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

## Future Required Checks

- Add Playwright browser tests when real UI workflows exist.
- Add security/dependency checks where practical.
- Keep coverage targets meaningful as business logic grows.
