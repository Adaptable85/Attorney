import { describe, expect, it } from "vitest";

import {
  canApproveInvoices,
  canApproveStatements,
  canCreateAgentDraftSuggestions,
  canCreateClients,
  canCreateMatters,
  canCreateDraftLineItems,
  canDeleteProtectedRecords,
  canDownloadDocuments,
  canEditClients,
  canEditMatters,
  canOverrideAccountingData,
  canPublishMarketing,
  canRolePerform,
  canSendClientCommunication,
  canSendOutreach,
  canViewDocumentMetadata,
  canViewAuditLogs,
  getRolePermissions
} from "./permission-policy";

describe("role permission policy", () => {
  it("allows the owner/principal to approve invoices and statements", () => {
    expect(canApproveInvoices("OWNER_PRINCIPAL")).toBe(true);
    expect(canApproveStatements("OWNER_PRINCIPAL")).toBe(true);
  });

  it("keeps support admins out of invoice and statement approval by default", () => {
    expect(canApproveInvoices("SUPPORT_ADMIN")).toBe(false);
    expect(canApproveStatements("SUPPORT_ADMIN")).toBe(false);
  });

  it("blocks agent service users from protected actions", () => {
    expect(canApproveInvoices("AGENT_SERVICE")).toBe(false);
    expect(canRolePerform("AGENT_SERVICE", "send_statement")).toBe(false);
    expect(canPublishMarketing("AGENT_SERVICE")).toBe(false);
    expect(canSendOutreach("AGENT_SERVICE")).toBe(false);
    expect(canDeleteProtectedRecords("AGENT_SERVICE")).toBe(false);
    expect(canOverrideAccountingData("AGENT_SERVICE")).toBe(false);
    expect(canSendClientCommunication("AGENT_SERVICE")).toBe(false);
  });

  it("allows agent service users to create drafts and suggestions only", () => {
    expect(canCreateDraftLineItems("AGENT_SERVICE")).toBe(true);
    expect(canCreateAgentDraftSuggestions("AGENT_SERVICE")).toBe(true);
    expect(getRolePermissions("AGENT_SERVICE")).toEqual([
      "create_draft_line_item",
      "create_agent_draft_suggestion"
    ]);
  });

  it("keeps read-only reviewers from editing, approving, sending or publishing", () => {
    expect(canRolePerform("READ_ONLY_REVIEWER", "view_assigned_records")).toBe(true);
    expect(canRolePerform("READ_ONLY_REVIEWER", "edit_protected_record")).toBe(false);
    expect(canApproveInvoices("READ_ONLY_REVIEWER")).toBe(false);
    expect(canRolePerform("READ_ONLY_REVIEWER", "send_statement")).toBe(false);
    expect(canPublishMarketing("READ_ONLY_REVIEWER")).toBe(false);
  });

  it("allows support admins to perform only explicitly defined support actions", () => {
    expect(canRolePerform("SUPPORT_ADMIN", "view_assigned_records")).toBe(true);
    expect(canRolePerform("SUPPORT_ADMIN", "record_admin_note")).toBe(true);
    expect(canRolePerform("SUPPORT_ADMIN", "upload_document")).toBe(true);
    expect(canRolePerform("SUPPORT_ADMIN", "delete_protected_record")).toBe(false);
    expect(canRolePerform("SUPPORT_ADMIN", "override_accounting_data")).toBe(false);
  });

  it("restricts audit log visibility to the owner/principal", () => {
    expect(canViewAuditLogs("OWNER_PRINCIPAL")).toBe(true);
    expect(canViewAuditLogs("SUPPORT_ADMIN")).toBe(false);
    expect(canViewAuditLogs("AGENT_SERVICE")).toBe(false);
    expect(canViewAuditLogs("READ_ONLY_REVIEWER")).toBe(false);
  });

  it("enforces client, matter and document permission boundaries", () => {
    expect(canCreateClients("OWNER_PRINCIPAL")).toBe(true);
    expect(canEditClients("SUPPORT_ADMIN")).toBe(true);
    expect(canCreateMatters("SUPPORT_ADMIN")).toBe(true);
    expect(canEditMatters("READ_ONLY_REVIEWER")).toBe(false);
    expect(canCreateClients("AGENT_SERVICE")).toBe(false);
    expect(canViewDocumentMetadata("READ_ONLY_REVIEWER")).toBe(true);
    expect(canDownloadDocuments("READ_ONLY_REVIEWER")).toBe(false);
    expect(canDownloadDocuments("AGENT_SERVICE")).toBe(false);
  });
});
