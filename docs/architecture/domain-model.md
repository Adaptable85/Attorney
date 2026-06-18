# Domain Model

Status: Phase 1B foundation
Date: 2026-06-18

This document describes the core domain model. Phase 1B implements the client, matter, document metadata and timeline persistence foundation in addition to the Phase 1A auth/permission/audit foundation.

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

Invoice, statement, payment/import, Lexpro, marketing and outreach models are still planned only.

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

Invariant:

- Voice notes create draft billing line items only.
- VAT rules must remain configurable.

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

Invariant:

- Owner/principal approval is required before invoice sending.
- Invoice numbers are assigned only on owner/principal approval.

## Invoice Approvals

Approval records for invoices.

Planned fields:

- id
- invoice id
- approver id
- decision
- notes
- created at

## Invoice PDFs

Generated invoice document records.

Planned fields:

- id
- invoice id
- storage key
- version
- generated at
- generated by

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

Invariant:

- Owner/principal approval is required before statement sending.

## Statement Approvals

Approval records for statements.

Planned fields:

- id
- statement id
- approver id
- decision
- notes
- created at

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
