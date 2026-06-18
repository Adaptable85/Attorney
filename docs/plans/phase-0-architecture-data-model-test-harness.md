# Phase 0: Architecture, Data Model, Test Harness

Status: Accepted for implementation
Phase: 0
Date: 2026-06-18

## Summary

Create the technical foundation for the Burgess Attorneys Admin Automation Platform without building product features.

This phase establishes the TypeScript/Next.js app shell, deterministic validation commands, Vitest test harness, architecture documentation, domain model documentation and ADRs for the hard decisions already captured.

## Scope

- Initialize a minimal TypeScript Next.js App Router foundation.
- Use pnpm as the package manager.
- Add lint, typecheck, test, coverage, build and pre-PR scripts.
- Add a small Vitest harness with foundation/invariant tests only.
- Add architecture and domain model documentation.
- Add accepted ADRs for the hard decisions already made.
- Update repo context and validation scripts with real commands.

## Non-Goals

- No admin dashboard.
- No invoice workflow implementation.
- No statement workflow implementation.
- No WhatsApp automation.
- No Lexpro import/sync.
- No website rebuild.
- No marketing or outreach system.
- No production auth implementation.
- No database migrations or real Prisma models.
- No client document storage implementation.

## Assumptions

- The project will use TypeScript, Next.js App Router and a modular monolith structure.
- PostgreSQL is the likely production database.
- Prisma is the intended ORM unless Phase 0/1 discovery finds a strong reason to change.
- Zod will be used for runtime validation at boundaries.
- Business logic will live in server-side services/domain modules, not directly in UI components.
- Phase 0 may include tiny invariant helpers and tests only to prove the test harness and guardrails.

## Risks

- Next.js, Prisma, auth and hosting decisions will become harder to reverse once product work starts.
- Prisma model implementation should not begin until the domain model and source-of-truth boundaries are accepted.
- A placeholder app can accidentally grow into product UI; Phase 0 must stop before feature screens.
- Coverage targets are not meaningful until real business logic exists, but the target must be documented now.

## Implementation Steps

1. Confirm repo is clean and Phase -1 foundation is present.
2. Create ADRs for accepted hard decisions.
3. Add package setup with pnpm, TypeScript, Next.js, Zod, Prisma dependency direction and Vitest.
4. Add minimal App Router shell and health route.
5. Add foundation-only domain invariant helper.
6. Add Vitest config and tests.
7. Add lint/typecheck/test/build/pre-pr scripts.
8. Add domain model and technical architecture docs.
9. Update `.context/`, `AGENTS.md`, `CLAUDE.md` and validation scripts.
10. Run deterministic validation.
11. Commit the Phase 0 foundation.

## Validation

Run:

```sh
git status
pnpm install
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run build
./scripts/check-agent-context.sh
./scripts/check-adr-needed.sh
./scripts/pre-pr-review.sh
```

## Rollback / Recovery

- Before commit: revert Phase 0 files with Git.
- After commit: use a normal revert commit if the foundation decision needs to be undone.
- Do not delete Phase -1 context; it remains the operating baseline.

## Open Questions

- Final auth provider.
- Final hosting provider.
- Final file storage provider.
- Exact PostgreSQL hosting.
- Email integration provider.
- WhatsApp integration provider.
- Lexpro integration mechanism.
- Exact invoice/statement PDF generation approach.

## Acceptance Criteria

- Git repo remains local and clean after commit.
- App foundation builds successfully.
- Lint, typecheck and tests run through package scripts.
- Pre-PR review runs the real available commands.
- ADRs exist for accepted hard decisions.
- Domain model documentation captures planned entities and invariants.
- Technical architecture documentation captures modular monolith direction and placeholders.
- No product features are implemented.

