import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { hasAdminShellAccess } from "@/auth/admin-access";
import {
  canApproveInvoices,
  canApproveStatements,
  canCreateDraftLineItems,
  canViewAuditLogs,
  canViewFinancialRecords
} from "./permission-policy";
import type { RoleKey } from "./roles";

export type AdminDashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export type AdminDashboardItem = {
  title: string;
  description: string;
  meta: string;
};

export type AdminDashboardSection = {
  id: string;
  title: string;
  description: string;
  demoLabel: "Demo placeholder data";
  metrics: readonly AdminDashboardMetric[];
  items: readonly AdminDashboardItem[];
  actions: readonly [];
  isVisibleForRole(role: RoleKey): boolean;
};

export type AdminDashboardModel = {
  title: "Read-only admin dashboard";
  boundaryLabel: "Demo placeholder data only";
  sections: readonly AdminDashboardSection[];
};

const dashboardSections: readonly AdminDashboardSection[] = [
  {
    id: "open-matter-visibility",
    title: "Open Matter Visibility",
    description: "Read-only placeholder for future matter workload visibility.",
    demoLabel: "Demo placeholder data",
    metrics: [
      {
        label: "Demo open files",
        value: "12",
        detail: "Fake count for layout validation only."
      },
      {
        label: "Demo matters needing review",
        value: "3",
        detail: "Placeholder queue without live operational data."
      }
    ],
    items: [
      {
        title: "Demo Client A - Contract review",
        description: "Placeholder matter summary with no client file data.",
        meta: "Next step placeholder: internal review window"
      },
      {
        title: "Demo Client B - Property transfer",
        description: "Placeholder matter summary for dashboard spacing.",
        meta: "Next step placeholder: document checklist"
      }
    ],
    actions: [],
    isVisibleForRole: (role) => canViewFinancialRecords(role)
  },
  {
    id: "upcoming-next-steps",
    title: "Upcoming Next Steps",
    description: "Read-only placeholder for future diary and follow-up visibility.",
    demoLabel: "Demo placeholder data",
    metrics: [
      {
        label: "Demo upcoming reminders",
        value: "5",
        detail: "Fake reminder count. No calendar integration exists."
      }
    ],
    items: [
      {
        title: "Demo follow-up window",
        description: "Illustrates where a future next-step summary may appear.",
        meta: "Due date placeholder"
      }
    ],
    actions: [],
    isVisibleForRole: (role) => canViewFinancialRecords(role)
  },
  {
    id: "pending-approval-placeholders",
    title: "Pending Approval Placeholders",
    description: "Owner/principal visibility placeholder for future invoice and statement review.",
    demoLabel: "Demo placeholder data",
    metrics: [
      {
        label: "Demo invoice review queue",
        value: "2",
        detail: "No invoice approval action is implemented."
      },
      {
        label: "Demo statement review queue",
        value: "1",
        detail: "No statement sending action is implemented."
      }
    ],
    items: [
      {
        title: "Demo financial record awaiting owner review",
        description: "Placeholder only. Official numbers remain approval-controlled.",
        meta: "No approval control available"
      }
    ],
    actions: [],
    isVisibleForRole: (role) => canApproveInvoices(role) || canApproveStatements(role)
  },
  {
    id: "preparation-placeholders",
    title: "Preparation Placeholders",
    description: "Support-admin-safe preparation view without owner-only controls.",
    demoLabel: "Demo placeholder data",
    metrics: [
      {
        label: "Demo draft preparation items",
        value: "4",
        detail: "Future preparation queue. No final approval controls."
      }
    ],
    items: [
      {
        title: "Demo draft billing preparation",
        description: "Support users may prepare draft work in later phases.",
        meta: "Owner approval remains separate"
      }
    ],
    actions: [],
    isVisibleForRole: (role) => canCreateDraftLineItems(role)
  },
  {
    id: "recent-audit-timeline",
    title: "Recent Audit / Timeline Placeholder",
    description: "Read-only placeholder for future sensitive action and matter timeline review.",
    demoLabel: "Demo placeholder data",
    metrics: [
      {
        label: "Demo audit events",
        value: "8",
        detail: "Fake audit count. No live audit feed is displayed."
      }
    ],
    items: [
      {
        title: "Demo timeline entry",
        description: "Placeholder event for future audit and timeline visibility.",
        meta: "Sensitive actions will be audit logged"
      }
    ],
    actions: [],
    isVisibleForRole: canViewAuditLogs
  },
  {
    id: "agent-draft-queue",
    title: "Agent Draft Queue Placeholder",
    description: "Read-only placeholder for future agent-prepared drafts.",
    demoLabel: "Demo placeholder data",
    metrics: [
      {
        label: "Demo agent drafts",
        value: "6",
        detail: "Agents remain draft-only and cannot access the normal admin shell."
      }
    ],
    items: [
      {
        title: "Demo draft routing item",
        description: "Placeholder for future human review of agent-prepared work.",
        meta: "Draft-only boundary"
      }
    ],
    actions: [],
    isVisibleForRole: (role) => canViewFinancialRecords(role)
  },
  {
    id: "lexpro-boundary-reminder",
    title: "Lexpro / Accounting Boundary Reminder",
    description: "Lexpro remains the accounting source of truth.",
    demoLabel: "Demo placeholder data",
    metrics: [
      {
        label: "Demo sync state",
        value: "Not connected",
        detail: "No Lexpro import, sync or payment reconciliation exists."
      }
    ],
    items: [
      {
        title: "Accounting source-of-truth reminder",
        description:
          "Lexpro remains the accounting source of truth for trust, bookkeeping and reconciled payment records.",
        meta: "Burgess platform owns invoices and client-facing statement PDFs only"
      }
    ],
    actions: [],
    isVisibleForRole: (role) => canViewFinancialRecords(role)
  }
];

export function hasDashboardAccess(principal: AuthenticatedPrincipal | null): boolean {
  return hasAdminShellAccess(principal);
}

export function getVisibleDashboardSections(
  principal: AuthenticatedPrincipal | null
): readonly AdminDashboardSection[] {
  if (!principal || !hasDashboardAccess(principal)) {
    return [];
  }

  return dashboardSections.filter((section) =>
    principal.roles.some((role) => section.isVisibleForRole(role))
  );
}

export function getAdminDashboardModel(
  principal: AuthenticatedPrincipal | null
): AdminDashboardModel {
  return {
    title: "Read-only admin dashboard",
    boundaryLabel: "Demo placeholder data only",
    sections: getVisibleDashboardSections(principal)
  };
}
