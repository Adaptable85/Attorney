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

Read-only client/matter UI workflow:

- Demo data must be clearly labelled until a real read model is accepted.
- Do not render active edit, delete, send or approval controls.
- Payment and statement fields must remain placeholders until Lexpro/accounting and statement workflows are accepted.

Client/matter form workflow:

- Disabled form foundations may exist before persistence.
- Do not enable save actions until server-side validation, service calls, permission checks and audit logging are tested.
- Agent service and read-only reviewer users must remain blocked from create forms.

Audited persistence workflow:

- Authenticated sessions must map through fail-closed role mapping before service use.
- Mutation-capable services must receive service context with actor, role, source and audit writer.
- Permission checks and audit metadata are required before mutation preparation runs.
- UI must not write directly to repositories.
- Local Prisma client/matter adapters may be used only for local development and DB integration tests until production auth and transaction/outbox behavior are reviewed.
- Client/matter create forms must stay disabled until live audited persistence is explicitly accepted.
- Future live writes must inject a transaction boundary so audit recording and repository mutation commit or fail together.
- AuditLog is the current internal outbox-equivalent; separate outbox work waits for external event dispatch.
- Local/dev service composition may exercise audited persistence in backend tests only.
- App UI routes must not import local/dev composition until a live-write phase is explicitly accepted.
- Client/matter write release gates must default off and fail closed for missing or unknown flag values.
- Future production client/matter writes require production auth readiness, audited persistence readiness and explicit write enablement.
- Future local/dev write tests require explicit local/dev write enablement.
- Future server actions or API mutation routes must evaluate the mutation gate before service mutation code runs.
- Mutation gate inputs must include a production-compatible principal, service context, permission action, audit metadata and transaction boundary.
- Phase 3E does not enable server actions, API mutation routes or form saves.
- Production auth readiness must be explicit and must not treat local/dev auth as production-ready.
- Disabled mutation skeletons may evaluate gates in tests but must still return disabled until a live-write phase is accepted.
- Phase 3F does not wire skeletons to UI, app routes, active server actions or API mutation routes.
- Dev-only mutation functions may write only when `clientMatterWritesEnabled`, `localDevWritesEnabled`, `devMutationEntrypointsEnabled` and audited persistence are explicitly enabled in local/dev.
- Dev-only mutation functions must use local/dev composition and fake `DEMO-*` account numbers.
- Production writes additionally require production auth readiness and explicit production write enablement.
- Phase 3G keeps create forms disabled and unwired from mutation functions.
- Phase 3H observed this execution environment has no `psql`, `pg_isready` or `createdb`, so DB tests were skipped here.
- Phase 3K.1 accepts Microsoft Entra ID / Microsoft 365 identity as the production auth provider direction.
- Phase 4A adds the Entra auth skeleton only; do not treat complete Entra placeholder config as live login or production write approval.
- Phase 4B adds disabled Entra route placeholders and session shape validation only; do not treat route existence as live auth readiness.
- Phase 4C adds OAuth state/nonce, PKCE and token-validation skeletons only; do not treat token claim-shape validation as authenticated login.
- Phase 4D adds OAuth state storage and JWKS cache boundaries only; do not wire them to live routes or default network fetches.
- Phase 4E adds disabled-by-default Entra staging dependency wiring only; do not treat wired state/cache dependencies as live auth, route enablement or production write readiness.
- Phase 4F adds JWT/JWKS verifier and key-selection boundaries only; do not treat verifier interfaces as live login, route enablement, session creation or production write readiness.
- Do not enable `BURGESS_PRODUCTION_AUTH_ENABLED`, `BURGESS_PRODUCTION_AUTH_CONFIGURED` or `BURGESS_PRODUCTION_WRITES_ENABLED` until Entra tenant/admin access, MFA policy, allowed users/domains, role claim approach, environment configuration, staging validation and production readiness review are complete.

Migration workflow:

- Validate Prisma schema locally.
- Generate/apply migrations only when explicitly instructed.
- Never run production migrations automatically by agent.
- Review schema diffs, SQL, backup status and rollback strategy before staging/production migrations.
- Run `pnpm run test:db` only with a safe local/dev `DATABASE_URL`.
- Use `pnpm run test:db:local` only when local PostgreSQL is available.
- Use `pnpm run db:migrate:local` only for reviewed local migrations.
- Do not add an outbox table or schema change without an accepted migration plan.
- Local/dev composition DB tests must use fake `DEMO-*` data only.
- Dev-only mutation DB tests must stay behind `pnpm run test:db` and the safe local database guard.

## Approval Workflow Principle

Future product workflows must preserve mandatory owner/principal approval for:

- Invoices.
- Statements.
- Legal/status communications.
- Marketing.
- Outreach.

## Agent Workflow Principle

Agents may draft and route work only. They may not approve, send, publish, delete protected records, override accounting data or provide final legal advice.
