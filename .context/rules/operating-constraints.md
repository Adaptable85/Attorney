# Operating Constraints

## Always Applicable

- This is a legal-admin platform for Burgess Attorneys Inc.
- Client files, documents, communications and financial records are sensitive.
- Owner/principal attorney approval is mandatory for invoices, statements, legal/status communications, marketing and outreach.
- OpenClaw/AI agents may draft, prepare, transcribe, classify, research and route work only.
- OpenClaw/AI agents may not approve, send, publish, delete protected records, override accounting data or provide final legal advice.
- Wesley/build support must not have owner approval powers by default.
- Voice notes create draft billing line items only.
- Invoice numbers are assigned only on owner/principal approval.
- Lexpro remains source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.
- Burgess platform is source of truth for invoices and client-facing statement PDFs only.
- Approved financial records require correction records/audit records for changes.
- Client documents must be private by default.
- Sensitive actions must be audit logged.
- No secrets in Git.
- No hardcoded fallback financial data.
- No unapproved delete endpoints for protected records.
- No public file storage for client documents.
- Day-one role keys are OWNER_PRINCIPAL, SUPPORT_ADMIN, AGENT_SERVICE, and READ_ONLY_REVIEWER.
- Any future permission override must be explicit and tested.
- OpenClaw/AI agents may not create or edit client or matter records directly.
- Document records store metadata only unless a future storage decision explicitly changes this.
- Money must be stored in integer cents, not floating point values.
- VAT overrides require a reason.
- Draft invoices must not have official invoice numbers.
- Statement records are snapshots and require approval before sending.
- Production migrations must not be run automatically by agents.
- Financial/client/legal data migrations require explicit human review.
- Seed data must not contain real client data.
- Repository interfaces must not expose hard-delete methods for protected records.
- Admin shell placeholders must not imply that CRUD, approval, sending, publishing, upload, download or sync workflows are implemented.
- Admin dashboard demo values must not imply live operational counts or implemented workflow actions.
- Agent service users must not receive normal admin shell navigation by default.
- Client/matter service routes or UI must not bypass server-side service permission checks.
- Read-only client/matter UI must not render active edit, delete, send or approval controls.

## Phase -1 Constraints

- Do not build product features.
- Do not create dashboard, invoice, statement, WhatsApp, Lexpro, website, marketing or outreach implementation.
- Create repo-local operating system only.
- Hooks must be deterministic and low-noise.
- Hooks must not call AI models.
