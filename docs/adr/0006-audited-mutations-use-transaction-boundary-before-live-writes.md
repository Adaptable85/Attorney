# 0006: Audited Mutations Use Transaction Boundary Before Live Writes

Status: Accepted
Date: 2026-06-23

## Context

Client and matter repository adapters now prove local Prisma persistence, but Phase 3B left audit recording and data mutation non-atomic. Burgess Attorneys will store sensitive legal-admin records, so future live writes must not persist business data without a coupled audit record. A full external-event outbox table is premature because no dispatcher or integration event workflow exists yet.

## Decision

Audited service mutations must run audit recording and repository mutation inside an injected transaction boundary before any UI or route live write is enabled. For now, the AuditLog row is the internal outbox-equivalent record for audited persistence. A separate outbox table is deferred until external event dispatch is introduced.

## Consequences

- Normal tests can use a fake or immediate transaction boundary without a database.
- Local DB tests can prove Prisma transaction commit and rollback behavior.
- Live UI saves remain disabled until production auth and transaction-wired repositories are reviewed.
- Future external integrations will need a separate outbox ADR or implementation plan.
