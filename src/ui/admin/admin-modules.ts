import {
  canCreateAgentDraftSuggestions,
  canPublishMarketing,
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
  href: string;
  description: string;
  status: "Not implemented yet";
  phaseLabel: "Coming in later phase";
  isVisibleForRole(role: RoleKey): boolean;
};

export const adminModules: readonly AdminModule[] = [
  {
    id: "clients",
    title: "Client Review",
    navLabel: "Clients",
    href: "/admin/clients",
    description: "Read-only demo client list for structure review. No create, edit or delete action is available.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewFinancialRecords
  },
  {
    id: "matters",
    title: "Matter Review",
    navLabel: "Matters",
    href: "/admin/matters",
    description: "Read-only demo matter list for workflow review. No edit, delete, send or approval action is available.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewFinancialRecords
  },
  {
    id: "document-review",
    title: "Document Review",
    navLabel: "Documents",
    href: "/admin/documents",
    description: "Private-document review placeholder. No upload, download or public storage is available.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewDocumentMetadata
  },
  {
    id: "pending-invoice-approvals",
    title: "Billing Review",
    navLabel: "Billing",
    href: "/admin/billing",
    description: "Invoice and statement structure placeholder. No approval, numbering, sending or external collection action exists.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewFinancialRecords
  },
  {
    id: "lexpro-boundary",
    title: "Lexpro Boundary",
    navLabel: "Lexpro",
    href: "/admin/lexpro",
    description: "Accounting boundary placeholder only. Lexpro remains the accounting source of truth.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewFinancialRecords
  },
  {
    id: "audit-log",
    title: "Audit Trail",
    navLabel: "Audit",
    href: "/admin/audit",
    description: "Sensitive-action review placeholder. Live audit events are not displayed yet.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewFinancialRecords
  },
  {
    id: "access-control",
    title: "Settings / Access Control",
    navLabel: "Access",
    href: "/admin/access",
    description: "Role and gate review placeholder. Live Microsoft Entra auth and production writes remain disabled.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewFinancialRecords
  },
  {
    id: "agent-drafts",
    title: "Agent Drafts",
    navLabel: "Agent Drafts",
    href: "/admin/dashboard",
    description: "Draft routing placeholder. Agents cannot access this admin shell.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canCreateAgentDraftSuggestions
  },
  {
    id: "website-marketing",
    title: "Website / Marketing Placeholder",
    navLabel: "Marketing",
    href: "/admin/dashboard",
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
