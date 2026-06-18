# Phase 1B: Clients, Matters, Document Metadata And Timeline Persistence

Status: Accepted for implementation
Phase: 1B
Date: 2026-06-18

## Summary

Create the client, matter, document metadata and timeline persistence foundation that later admin screens can use safely.

This phase adds database schema foundations and tested domain helpers only. It does not add dashboard UI, CRUD pages, storage implementation, invoices, statements, Lexpro, WhatsApp, marketing or outreach.

## Scope

- Add Prisma models for clients, contacts, matters, matter assignments, matter notes, document metadata and timeline events.
- Add enums for client/matter/document/timeline state.
- Add Zod validation and normalization helpers for client and matter inputs.
- Add document metadata defaults and access guard helpers.
- Add timeline event payload helpers.
- Add permission policy actions for client/matter editing and document access.
- Add audit event categories for client/matter/document/timeline actions.
- Add tests for validation, permissions, audit categories, document privacy and timeline payloads.

## Non-Goals

- No admin dashboard.
- No client or matter UI pages.
- No invoice or statement UI.
- No WhatsApp automation.
- No Lexpro import/sync.
- No website pages.
- No marketing or outreach features.
- No file upload/download storage.
- No hard delete helpers for protected records.
- No production database migration.

## Assumptions

- Client and matter records are protected operational records.
- Client documents are metadata-only in this phase and private by default.
- Owner/principal and support admin can create/edit client and matter records.
- Read-only reviewer can view permitted records but cannot edit.
- Agent service users cannot directly create/edit client or matter records.
- Timeline events will later be persisted but can be represented as typed payloads now.

## Risks

- Future storage provider choice may change document metadata fields.
- Future client/matter UI may require additional filter/index fields.
- Future auth provider may affect assignment and access rules.
- No migration is applied yet, so schema changes still need migration planning before a real database is used.

## Implementation Steps

1. Confirm clean Git status.
2. Add Phase 1B plan.
3. Extend Prisma schema with client/matter/document/timeline foundation only.
4. Extend permission policy with client/matter/document access actions.
5. Extend audit event types for client/matter/document/timeline actions.
6. Add Zod domain helpers for clients and matters.
7. Add document metadata and access helpers.
8. Add timeline event helper.
9. Add focused tests.
10. Update affected docs/context.
11. Run deterministic validation.
12. Commit Phase 1B.

## Validation

Run:

```sh
git status
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

## Rollback / Recovery

- Before commit: revert Phase 1B files with Git.
- After commit: use a normal revert commit.
- Do not remove Phase -1, Phase 0 or Phase 1A operating context.

## Acceptance Criteria

- Prisma schema validates.
- Client/matter/document/timeline models exist without invoice, statement, payment, Lexpro, marketing or outreach models.
- Document metadata stores no raw file content field and defaults to private.
- Client and matter validation tests pass.
- Permission tests prove owner/support admin edit access and agent/read-only restrictions.
- Audit tests include client/matter/document/timeline events.
- Timeline payload tests include actor, subject and event type.
- Full pre-PR validation passes.

## Open Questions

- Exact matter assignment labels needed by Burgess Attorneys.
- Whether account number is client-wide, matter-specific, or both in production data.
- Final storage provider and object-key strategy.
- Final policy for read-only reviewer record scoping.
- Whether timeline events should duplicate audit logs or reference audit log IDs in later phases.

