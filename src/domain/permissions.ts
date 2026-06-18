export const PERMISSION_ACTIONS = [
  "approve_invoice",
  "approve_statement",
  "send_client_communication",
  "send_statement",
  "publish_marketing",
  "send_outreach",
  "delete_protected_record",
  "override_accounting_data",
  "create_draft_line_item",
  "create_agent_draft_suggestion",
  "create_client",
  "edit_client",
  "create_matter",
  "edit_matter",
  "view_document_metadata",
  "download_document",
  "create_timeline_event",
  "view_audit_logs",
  "view_assigned_records",
  "record_admin_note",
  "upload_document",
  "edit_protected_record"
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const PROTECTED_ACTIONS: ReadonlySet<PermissionAction> = new Set([
  "approve_invoice",
  "approve_statement",
  "send_client_communication",
  "send_statement",
  "publish_marketing",
  "send_outreach",
  "delete_protected_record",
  "override_accounting_data",
  "create_client",
  "edit_client",
  "create_matter",
  "edit_matter",
  "download_document",
  "edit_protected_record"
]);

export function isPermissionAction(value: string): value is PermissionAction {
  return PERMISSION_ACTIONS.includes(value as PermissionAction);
}
