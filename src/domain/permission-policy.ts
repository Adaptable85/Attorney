import type { PermissionAction } from "./permissions";
import type { RoleKey } from "./roles";

const rolePermissions: Record<RoleKey, readonly PermissionAction[]> = {
  OWNER_PRINCIPAL: [
    "approve_invoice",
    "approve_statement",
    "send_client_communication",
    "send_statement",
    "publish_marketing",
    "send_outreach",
    "delete_protected_record",
    "override_accounting_data",
    "create_draft_line_item",
    "edit_draft_billing_line_item",
    "create_agent_draft_suggestion",
    "create_client",
    "edit_client",
    "create_matter",
    "edit_matter",
    "view_document_metadata",
    "download_document",
    "create_timeline_event",
    "view_financial_records",
    "create_financial_correction",
    "override_vat_treatment",
    "assign_invoice_number",
    "view_audit_logs",
    "view_assigned_records",
    "record_admin_note",
    "upload_document",
    "edit_protected_record"
  ],
  SUPPORT_ADMIN: [
    "create_draft_line_item",
    "edit_draft_billing_line_item",
    "create_client",
    "edit_client",
    "create_matter",
    "edit_matter",
    "view_document_metadata",
    "download_document",
    "create_timeline_event",
    "view_financial_records",
    "view_assigned_records",
    "record_admin_note",
    "upload_document"
  ],
  AGENT_SERVICE: ["create_draft_line_item", "create_agent_draft_suggestion"],
  READ_ONLY_REVIEWER: [
    "view_assigned_records",
    "view_document_metadata",
    "view_financial_records"
  ]
};

export function canRolePerform(role: RoleKey, action: PermissionAction): boolean {
  return rolePermissions[role].includes(action);
}

export function getRolePermissions(role: RoleKey): readonly PermissionAction[] {
  return rolePermissions[role];
}

export function canApproveInvoices(role: RoleKey): boolean {
  return canRolePerform(role, "approve_invoice");
}

export function canApproveStatements(role: RoleKey): boolean {
  return canRolePerform(role, "approve_statement");
}

export function canSendClientCommunication(role: RoleKey): boolean {
  return canRolePerform(role, "send_client_communication");
}

export function canPublishMarketing(role: RoleKey): boolean {
  return canRolePerform(role, "publish_marketing");
}

export function canSendOutreach(role: RoleKey): boolean {
  return canRolePerform(role, "send_outreach");
}

export function canDeleteProtectedRecords(role: RoleKey): boolean {
  return canRolePerform(role, "delete_protected_record");
}

export function canOverrideAccountingData(role: RoleKey): boolean {
  return canRolePerform(role, "override_accounting_data");
}

export function canCreateDraftLineItems(role: RoleKey): boolean {
  return canRolePerform(role, "create_draft_line_item");
}

export function canEditDraftBillingLineItems(role: RoleKey): boolean {
  return canRolePerform(role, "edit_draft_billing_line_item");
}

export function canCreateAgentDraftSuggestions(role: RoleKey): boolean {
  return canRolePerform(role, "create_agent_draft_suggestion");
}

export function canViewAuditLogs(role: RoleKey): boolean {
  return canRolePerform(role, "view_audit_logs");
}

export function canCreateClients(role: RoleKey): boolean {
  return canRolePerform(role, "create_client");
}

export function canEditClients(role: RoleKey): boolean {
  return canRolePerform(role, "edit_client");
}

export function canCreateMatters(role: RoleKey): boolean {
  return canRolePerform(role, "create_matter");
}

export function canEditMatters(role: RoleKey): boolean {
  return canRolePerform(role, "edit_matter");
}

export function canViewDocumentMetadata(role: RoleKey): boolean {
  return canRolePerform(role, "view_document_metadata");
}

export function canDownloadDocuments(role: RoleKey): boolean {
  return canRolePerform(role, "download_document");
}

export function canViewFinancialRecords(role: RoleKey): boolean {
  return canRolePerform(role, "view_financial_records");
}

export function canCreateFinancialCorrections(role: RoleKey): boolean {
  return canRolePerform(role, "create_financial_correction");
}

export function canOverrideVatTreatment(role: RoleKey): boolean {
  return canRolePerform(role, "override_vat_treatment");
}

export function canAssignInvoiceNumbers(role: RoleKey): boolean {
  return canRolePerform(role, "assign_invoice_number");
}
