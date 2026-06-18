# Task Management

## Phase Rules

Every future phase must include:

- Scope.
- Explicit non-scope.
- Acceptance criteria.
- Validation commands.
- Security/privacy implications.
- Testing plan.
- Rollback or correction approach where relevant.

## Work Style

- Keep PRs focused and deployable.
- Prefer small vertical slices after architecture is approved.
- Do not mix infrastructure decisions with product features unless the feature cannot be delivered without the decision.
- Use TDD first for business logic.
- Document TODOs when commands/frameworks are not yet available.

## Phase -1 Deliverable

Phase -1 is complete when:

- Required context files exist.
- Hooks exist.
- Validation scripts exist.
- Scripts are executable.
- Available deterministic validations have been run.
- Missing framework commands are documented as TODO.

## Future Phase Recommendation

Next phase should be Phase 0:

- Architecture.
- Data model.
- Test harness.
- ADR capture for accepted hard-to-reverse decisions.

