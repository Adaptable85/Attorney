export const AUDIT_EVENT_TYPES = [
  "login",
  "failed_login",
  "permission_change",
  "client_created",
  "client_edited",
  "client_record_accessed",
  "matter_created",
  "matter_edited",
  "matter_record_accessed",
  "matter_note_added",
  "document_accessed",
  "draft_created",
  "invoice_approved",
  "invoice_sent",
  "statement_approved",
  "statement_sent",
  "payment_import_changed",
  "agent_action",
  "document_metadata_created",
  "document_uploaded",
  "document_downloaded",
  "timeline_event_created",
  "marketing_approved",
  "outreach_approved"
] as const;

export type AuditEventType = (typeof AUDIT_EVENT_TYPES)[number];

export const SENSITIVE_AUDIT_EVENT_TYPES: ReadonlySet<AuditEventType> = new Set([
  "login",
  "failed_login",
  "permission_change",
  "client_created",
  "client_edited",
  "client_record_accessed",
  "matter_created",
  "matter_edited",
  "matter_record_accessed",
  "matter_note_added",
  "document_accessed",
  "draft_created",
  "invoice_approved",
  "invoice_sent",
  "statement_approved",
  "statement_sent",
  "payment_import_changed",
  "agent_action",
  "document_metadata_created",
  "document_uploaded",
  "document_downloaded",
  "timeline_event_created",
  "marketing_approved",
  "outreach_approved"
]);

export function isSensitiveAuditEvent(eventType: AuditEventType): boolean {
  return SENSITIVE_AUDIT_EVENT_TYPES.has(eventType);
}
