import {
  canApproveInvoices,
  canApproveStatements,
  canCreateAgentDraftSuggestions,
  canPublishMarketing,
  canViewAuditLogs,
  canViewDocumentMetadata,
  canViewFinancialRecords
} from "@/domain/permission-policy";
import type { RoleKey } from "@/domain/roles";
import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { hasAdminShellAccess } from "@/auth/admin-access";

export type AdminModule = {
  id: string;
  title: string;
  navLabel: string;
  description: string;
  status: "Not implemented yet";
  phaseLabel: "Coming in later phase";
  isVisibleForRole(role: RoleKey): boolean;
};

export const adminModules: readonly AdminModule[] = [
  {
    id: "active-matters",
    title: "Active Matters",
    navLabel: "Matters",
    description: "Placeholder for future matter overview and file administration.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: (role) => canViewFinancialRecords(role) || canViewDocumentMetadata(role)
  },
  {
    id: "pending-invoice-approvals",
    title: "Pending Invoice Approvals",
    navLabel: "Invoice Approvals",
    description: "Owner approval workflow placeholder. No invoice approval action exists here.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canApproveInvoices
  },
  {
    id: "pending-statement-approvals",
    title: "Pending Statement Approvals",
    navLabel: "Statement Approvals",
    description: "Owner statement approval placeholder. No statement sending action exists here.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canApproveStatements
  },
  {
    id: "document-review",
    title: "Document Review",
    navLabel: "Documents",
    description: "Metadata-only review placeholder. No upload or download is available.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewDocumentMetadata
  },
  {
    id: "audit-log",
    title: "Audit Log",
    navLabel: "Audit",
    description: "Audit visibility placeholder for future sensitive action review.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewAuditLogs
  },
  {
    id: "agent-drafts",
    title: "Agent Drafts",
    navLabel: "Agent Drafts",
    description: "Draft routing placeholder. Agents cannot access this admin shell.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canCreateAgentDraftSuggestions
  },
  {
    id: "lexpro-boundary",
    title: "Lexpro Boundary / Accounting Sync Placeholder",
    navLabel: "Lexpro Boundary",
    description: "Boundary placeholder only. Lexpro remains accounting source of truth.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewFinancialRecords
  },
  {
    id: "website-marketing",
    title: "Website / Marketing Placeholder",
    navLabel: "Marketing",
    description: "Marketing approval placeholder. No publishing or outreach action exists here.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canPublishMarketing
  }
];

export function getVisibleAdminModules(
  principal: AuthenticatedPrincipal | null
): readonly AdminModule[] {
  if (!principal || !hasAdminShellAccess(principal)) {
    return [];
  }

  const adminPrincipal = principal;

  return adminModules.filter((module) =>
    adminPrincipal.roles.some((role) => module.isVisibleForRole(role))
  );
}
