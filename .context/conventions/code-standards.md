# Code Standards

No application code exists in Phase -1.

Future code standards:

- Use the framework and language selected in Phase 0.
- Keep permission checks server-side.
- Keep financial rules configurable.
- Do not hardcode fallback financial data.
- Do not commit secrets.
- Do not expose client documents publicly.
- Avoid unapproved destructive operations for protected records.
- Prefer explicit audit records for sensitive mutations.
- Keep code readable and testable before optimizing.

Protected records include:

- Client files.
- Client documents.
- Communications.
- Invoice records.
- Statement records.
- Payment/import records.
- Agent action records.
- Permission records.

