# Mutation Entrypoint Design

Status: Phase 3E design pack
Date: 2026-06-23

## Server Action Vs API Route Trade-Off

Server actions fit form-driven internal workflows and keep mutation code close to the App Router. Route handlers are better for explicit HTTP APIs, integration clients and non-form callers.

No entrypoint is enabled in Phase 3E. Server actions or route handlers should be added only after production auth provider selection and release approval.

## Required Mutation Gate Checklist

Every future mutation entrypoint must require:

- Production-auth-compatible principal.
- Allowed role.
- Explicit release gate.
- Permission action.
- Service context.
- Audit metadata.
- Transaction boundary.
- Server-side validation.
- Safe typed errors.

## Required Service Context

Entrypoints must create service context from an authenticated principal and an approved audit writer. UI components must not construct service context directly.

## Required Audit Metadata

Audit metadata must include the event type, target type, summary and relevant identifiers. Audit metadata must be created before mutation work runs and must not include secrets.

## Required Transaction Boundary

Repository mutation and audit recording must run through an injected transaction boundary. Missing transaction dependency must fail closed.

## Feature Flag Requirement

Client/matter writes require explicit release gates. Missing or unknown flag values fail closed.

Required flags:

- `clientMatterWritesEnabled`
- `productionAuthConfigured`
- `auditedPersistenceEnabled`
- `localDevWritesEnabled` for local/dev testing only

## No Hard-Delete Rule

Mutation entrypoints must not expose hard-delete methods for protected client, matter, document, invoice, statement or financial records.

## No Invoice/Statement/Send Mutation Rule

Client/matter create gates do not authorize invoice, statement, send, PDF, WhatsApp, email, Lexpro, payment, marketing or outreach workflows. Those require separate phases and owner/principal approval gates.

## Form Enablement Requirements

Create forms may be enabled only after:

- Production auth provider is selected and configured.
- Mutation gate passes in staging.
- Audited transaction boundary is wired.
- Server-side tests cover roles and fail-closed behavior.
- Release approval is recorded.

## Test Requirements

- Missing user blocked.
- Agent blocked.
- Read-only reviewer blocked.
- Support admin allowed only when gate and permission allow.
- Owner allowed only when gate and permission allow.
- Gate disabled blocks everyone.
- Missing audit metadata blocked.
- Missing transaction dependency blocked.
- Raw errors are never exposed.

## Release Approval Checklist

- Production auth configured.
- Feature flags reviewed.
- Migration impact reviewed.
- Audit logs verified.
- Backup/rollback plan recorded.
- Owner/principal approval recorded.
- Create forms reviewed before enabling.

