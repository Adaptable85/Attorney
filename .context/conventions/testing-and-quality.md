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

No framework/test commands are confirmed in Phase -1.

Until tooling exists:

- `scripts/pre-pr-review.sh` runs context checks.
- Package commands are detected only if `package.json` exists.
- Missing commands are reported as TODO.

## Future Required Checks

When tooling exists, define deterministic commands for:

- Lint.
- Typecheck.
- Test.
- Build.
- Coverage.
- Security/dependency checks where practical.

