# Domain Model

Status: Phase 3F production auth adapter and disabled mutation entrypoints
Date: 2026-06-23

This document describes the core domain model. Phase 1D adds migration strategy, repository interfaces and seed fixtures on top of the prior schema/domain foundations.

## Core Entities

## Implemented In Phase 1A

Phase 1A Prisma models:

- User
- Role
- UserRole
- Permission
- RolePermission
- AuditLog
- AgentAction

Phase 1A enums:

- RoleKey
- UserStatus
- AuthProviderKind
- AuditEventType
- AgentActionStatus

Payment/import, Lexpro, marketing and outreach models are still planned only.

## Implemented In Phase 1B

Phase 1B Prisma models:

- Client
- Contact
- Matter
- MatterAssignment
- MatterNote
- DocumentRecord
- TimelineEvent

Phase 1B enums:

- ClientStatus
- ContactType
- MatterType
- MatterStatus
- MatterAssignmentRole
- DocumentVisibility
- DocumentStatus
- TimelineEventType

Phase 1B domain helpers:

- Client creation validation.
- Matter creation validation.
- Document metadata validation with private default.
- Timeline event payload creation.
- Permission helpers for client/matter editing and document access.

## Implemented In Phase 1C

Phase 1C Prisma models:

- BillingLineItem
- Invoice
- InvoiceLine
- InvoiceApproval
- InvoiceNumberSequence
- StatementSnapshot
- StatementLine
- StatementApproval
- FinancialCorrectionRecord

Phase 1C enums:

- BillingLineItemStatus
- BillingCategory
- VatTreatment
- InvoiceStatus
- StatementStatus
- FinancialCorrectionType
- FinancialRecordSource

Phase 1C domain helpers:

- Integer-cent money validation.
- Billing line item validation.
- VAT defaulting and override reason enforcement.
- Draft invoice validation.
- Invoice approval and invoice-number payload creation.
- Statement snapshot validation.
- Statement approval payload creation.
- Financial correction payload creation.

## Implemented In Phase 1D

Phase 1D adds:

- Reviewed database migration strategy.
- ADR for controlled Prisma migrations.
- Repository interface boundaries.
- Prisma client boundary.
- Deterministic fake test fixtures.
- Dev-only seed skeleton.

## Implemented In Phase 2C

Phase 2C adds server-side service boundaries for client and matter summaries:

- Client list/detail service functions.
- Matter list/detail service functions.
- Permission-guarded client/matter create service functions.
- Safe typed service errors.

The services use repository interfaces and do not expose hard-delete operations, API routes or production database wiring.

## Implemented In Phase 2D

Phase 2D adds read-only UI models for displaying client and matter summaries:

- Client list items with account number, demo client name, status, matter count and placeholder financial/payment labels.
- Matter list items with account number, client name, matter name/description, type, status, next step due date and placeholder operational labels.
- Matter detail items with the same required fields and a future-phase-only action label.

The UI models are demo-only and do not represent live operational records.

## Implemented In Phase 2E

Phase 2E adds disabled UI form foundations for future client and matter creation.

The forms are not domain mutations yet. They do not submit, persist, audit or create records.

## Implemented In Phase 3A

Phase 3A adds production-grade auth and audited service enablement:

- Fail-closed session-to-role mapping.
- Server-side admin user requirement helper.
- Service context with actor, primary role, source and audit writer.
- Audited mutation executor for future client/matter writes.
- Client/matter create service functions requiring audited service context.

The disabled forms remain non-mutating. No live client or matter persistence is exposed by UI, API routes or server actions.

## Implemented In Phase 3B

Phase 3B adds local-only Prisma repository adapters for client and matter records:

- Client adapter create/read/list/update/archive methods matching the repository interface.
- Matter adapter create/read/list/update/archive methods matching the repository interface.
- DB-specific integration tests for fake client and matter rows behind `pnpm run test:db`.
- Local/dev `DATABASE_URL` guard for DB tests.

The adapters do not change the domain model and do not enable live UI saves, server actions, API mutation routes or production database operations. Future live writes still require production auth and a transaction/outbox decision for audited persistence.

## Implemented In Phase 3C

Phase 3C adds an audited transaction boundary, not new domain entities:

- Audited mutation execution requires actor context, permission decision and audit metadata.
- Audit recording and repository mutation can run inside an injected transaction boundary.
- Client and matter create services accept an optional transaction boundary for future live persistence wiring.
- Prisma transaction behavior is tested only through guarded local DB tests.

ADR 0006 records the decision to use AuditLog as the immediate internal outbox-equivalent. A separate outbox table is deferred until external event dispatch exists. UI forms remain disabled and no live client or matter persistence is exposed.

## Implemented In Phase 3D

Phase 3D adds backend composition only:

- Prisma AuditLog repository adapter.
- Audit writer bridge from repository to service audit boundary.
- Local/dev client-matter service composition factory.
- Transaction-scoped client, matter and audit dependencies for DB-only tests.

It does not add domain entities, production auth, UI saves, server actions or API mutation routes.

## Implemented In Phase 3E

Phase 3E adds no domain entities. It adds production-auth and mutation-entrypoint design plus default-off release gates for future client/matter writes:

- Client/matter write feature flags default off.
- Production writes require production-auth readiness and audited persistence readiness.
- Local/dev writes require an explicit local/dev write flag.
- Future mutation entrypoints must pass a production-compatible principal, service context, permission check, audit metadata, transaction boundary and release gate before service mutation code can run.

It does not add a production auth provider, UI saves, server actions, API mutation routes, database migrations or production database operations.

## Implemented In Phase 3F

Phase 3F adds no domain entities. It adds production-auth adapter/readiness boundaries and disabled client/matter mutation skeletons:

- Production auth provider readiness defaults false.
- Provider claims must map through explicit internal role keys.
- Missing subject, email or role claims fail closed.
- Disabled client/matter skeletons evaluate release gate, service context, permission, audit metadata and transaction boundary requirements.
- Skeletons still return disabled typed errors and do not call repositories or persist records.

It does not add a production auth provider, UI saves, active server actions, API mutation routes, database migrations or production database operations.

Repository rules:

- No hard-delete methods for protected records.
- Approved invoices/statements are not updated directly.
- Correction records are required for approved financial changes.
- Document records remain metadata-only.
- Audit log writer is explicit.

Seed rules:

- Seed data must be fake.
- Seed data must not contain real Burgess client data.
- Dev seed must not run automatically in production.

## Users

People or service users that can access the platform.

Planned fields:

- id
- name
- email
- status
- role id
- created at
- updated at

Implemented in Phase 1B.
- auth provider
- external subject

Implemented in Phase 1A.

## Roles

Access groups for server-side permission checks.

Initial roles:

- Owner / Principal Attorney
- Wesley / Build Support
- OpenClaw Agent
- Read-Only Reviewer

Invariant:

- Wesley/build support must not have owner approval powers by default.
- OpenClaw Agent is draft-only by default.

Implemented in Phase 1A.

## Permissions

Explicit permission keys assigned to roles.

Implemented in Phase 1A through:

- Permission model.
- RolePermission model.
- Tested TypeScript permission policy.

Invariant:

- Future overrides must be explicit and tested.

## Clients

Client-level records for people or organisations.

Planned fields:

- id
- account number
- display name
- type
- status
- primary contact id
- created at
- updated at

## Contacts

People linked to clients and matters.

Planned fields:

- id
- client id
- name
- email
- phone
- WhatsApp number
- contact type

Implemented in Phase 1B.

## Matters

Legal matters or files linked to clients.

Planned fields:

- id
- client id
- matter name
- matter type
- description
- status
- assigned attorney id
- assigned admin id
- account number
- next-step due date
- opened at
- closed at

Implemented in Phase 1B.

Invariant:

- OpenClaw/AI agents may not create or edit client or matter records directly.
- Prefer soft status changes over deletion for protected records.

## Matter Notes

Internal notes on a matter.

Planned fields:

- id
- matter id
- author id
- note body
- visibility
- created at

Implemented in Phase 1B.

## Documents

Client or matter documents.

Planned fields:

- id
- client id
- matter id
- storage key
- filename
- content type
- size
- uploaded by
- access classification
- status
- created at

Implemented in Phase 1B.

Invariant:

- Client documents are private by default.
- No public file storage for client documents.
- DocumentRecord stores metadata only, not raw file content.

## Timeline Events

Unified matter/client activity stream.

Planned fields:

- id
- client id
- matter id
- event type
- actor id
- source
- summary
- metadata
- created at

Implemented in Phase 1B.

## Audit Logs

Immutable audit records for sensitive actions.

Planned fields:

- id
- actor id
- action
- target type
- target id
- previous value hash or summary
- new value hash or summary
- reason
- created at

Invariant:

- Sensitive actions are audit logged.

Implemented in Phase 1A as the AuditLog model and audit service boundary.

## Agent Actions

Actions taken or proposed by OpenClaw/AI agents.

Planned fields:

- id
- agent user id
- action type
- source channel
- source reference
- draft target type
- draft target id
- confidence score
- status
- created at

Invariant:

- Agents may draft, prepare, transcribe, classify, research and route only.
- Agents may not approve, send, publish, delete protected records, override accounting data or provide final legal advice.

Implemented in Phase 1A as an AgentAction model and tested permission restrictions.

## Billing Line Items

Draft or approved billing entries for invoice preparation.

Planned fields:

- id
- matter id
- source type
- source reference
- description
- quantity
- rate
- amount
- VAT treatment
- status
- created by
- approved by
- approved at

Implemented in Phase 1C.

Invariant:

- Voice notes create draft billing line items only.
- VAT rules must remain configurable.
- Money is stored as integer cents.

## Invoices

Client-facing invoices controlled by Burgess platform.

Planned fields:

- id
- internal draft id
- official invoice number
- client id
- matter id
- status
- subtotal
- VAT amount
- total
- created by
- approved by
- approved at
- sent at

Implemented in Phase 1C.

Invariant:

- Owner/principal approval is required before invoice sending.
- Invoice numbers are assigned only on owner/principal approval.
- Draft invoices use internal draft references only.
- Official invoice number is nullable until approval.

## Invoice Approvals

Approval records for invoices.

Planned fields:

- id
- invoice id
- approver id
- decision
- notes
- created at

Implemented in Phase 1C.

## Invoice Number Sequences

Controlled sequence records for official invoice numbers.

Implemented in Phase 1C.

## Invoice PDFs

Generated invoice document records.

Planned fields:

- id
- invoice id
- storage key
- version
- generated at
- generated by

Still planned only; PDF generation is not part of Phase 1C.

## Statements

Client-facing statement PDFs controlled by Burgess platform.

Planned fields:

- id
- client id
- matter id
- status
- statement period
- balance summary
- generated at
- approved by
- approved at
- sent at

Implemented in Phase 1C as StatementSnapshot.

Invariant:

- Owner/principal approval is required before statement sending.
- Statements are snapshots, not live mutable views.

## Statement Approvals

Approval records for statements.

Planned fields:

- id
- statement id
- approver id
- decision
- notes
- created at

Implemented in Phase 1C.

## Payment / Import Records

Operational payment visibility from Lexpro import/sync or manual entry.

Planned fields:

- id
- source
- external reference
- client id
- matter id
- amount
- payment date
- matched status
- imported by
- imported at

Invariant:

- Lexpro remains source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.

## Correction Records

Records for changes to approved financial data.

Planned fields:

- id
- target type
- target id
- correction type
- reason
- created by
- approved by
- created at

Invariant:

- Approved financial records require correction records/audit records for changes.
- Approved financial records must not be silently overwritten.

Implemented in Phase 1C as FinancialCorrectionRecord.

## Communication Drafts

Draft messages for email, WhatsApp, marketing or outreach.

Planned fields:

- id
- channel
- target client/contact/lead
- draft body
- created by
- created by agent action id
- status
- created at

## Communication Approvals

Approval records before sending sensitive communication.

Planned fields:

- id
- communication draft id
- approver id
- decision
- notes
- created at

Invariant:

- Owner/principal approval is required before legal/status communications, marketing and outreach are sent or published.

## Core Invariants

- Owner/principal approval required before sending invoices/statements.
- Agent cannot approve/send/publish.
- Invoice number assigned only on approval.
- Approved financial records require correction records.
- Documents private by default.
- Sensitive actions audit logged.
- Lexpro remains legal/trust accounting and reconciled payment source.
