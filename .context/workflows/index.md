# Workflows Index

## Phase Workflow

1. Confirm phase scope and non-scope.
2. Inspect repository state.
3. Write or update a plan in `docs/plans/`.
4. Confirm deterministic validation commands.
5. Implement with TDD where product code exists.
6. Run deterministic checks.
7. Run pre-PR review.
8. Record assumptions, TODOs and risks.

Current deterministic checks:

```sh
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run build
pnpm run pre-pr
```

Admin shell workflow:

- `/admin` is a protected placeholder shell only.
- `/admin/dashboard` is a protected read-only placeholder dashboard only.
- Role-aware navigation must follow the tested permission policy.
- Owner-only approval placeholders must not be visible to support admin by default.
- Dashboard demo values must stay clearly labelled and must not imply live operational counts.
- Agent service users must not receive normal admin navigation.
- Do not add CRUD, send, approve, publish, upload, download or sync actions until their phases are accepted.

Client/matter service workflow:

- Route handlers and UI must use service-layer permission checks rather than calling repositories directly.
- Service errors must be typed and user-safe.
- Future client/matter mutations must include audit-ready actor context.
- Do not add hard-delete operations for protected client or matter records.

Migration workflow:

- Validate Prisma schema locally.
- Generate/apply migrations only when explicitly instructed.
- Never run production migrations automatically by agent.
- Review schema diffs, SQL, backup status and rollback strategy before staging/production migrations.

## Approval Workflow Principle

Future product workflows must preserve mandatory owner/principal approval for:

- Invoices.
- Statements.
- Legal/status communications.
- Marketing.
- Outreach.

## Agent Workflow Principle

Agents may draft and route work only. They may not approve, send, publish, delete protected records, override accounting data or provide final legal advice.
