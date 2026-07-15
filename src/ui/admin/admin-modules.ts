import { canViewFinancialRecords } from "@/domain/permission-policy";
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
    title: "Client Files",
    navLabel: "Files",
    href: "/admin/clients",
    description: "Dense practice file workspace for client details, matters, general documents, draft statement position and audit review.",
    status: "Not implemented yet",
    phaseLabel: "Coming in later phase",
    isVisibleForRole: canViewFinancialRecords
  },
  {
    id: "invoice-items",
    title: "Invoice Items",
    navLabel: "Invoice Items",
    href: "/admin/invoice-items",
    description: "Separate reusable fee, disbursement and billing item maintenance for later matter billing selection.",
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
