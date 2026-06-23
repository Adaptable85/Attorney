import type { ClientSummary } from "@/services/clients-service";
import type { MatterSummary } from "@/services/matters-service";

export type ClientListItem = {
  id: string;
  accountNumber: string;
  displayName: string;
  statusLabel: string;
  matterCountLabel: string;
  latestStatementBalancePlaceholder: string;
  paymentStatusPlaceholder: string;
  demoLabel: "Demo placeholder data";
};

export type MatterListItem = {
  id: string;
  accountNumber: string;
  clientDisplayName: string;
  name: string;
  description: string;
  typeLabel: string;
  statusLabel: string;
  nextStepDueDateLabel: string;
  responsibleUserPlaceholder: string;
  latestInvoiceStatusPlaceholder: string;
  latestStatementBalancePlaceholder: string;
  lastCommunicationPlaceholder: string;
  paymentStatusPlaceholder: string;
  demoLabel: "Demo placeholder data";
};

export type MatterDetailItem = MatterListItem & {
  futureActionsLabel: "Future phase only - no active edit, delete, send or approval actions";
};

function formatDate(date: Date | undefined): string {
  if (!date) {
    return "Demo due date placeholder";
  }

  return date.toISOString().slice(0, 10);
}

function matterCountLabel(count: number): string {
  return `${count} demo ${count === 1 ? "matter" : "matters"}`;
}

function findClientName(clientId: string, clients: readonly ClientSummary[]): string {
  return clients.find((client) => client.id === clientId)?.displayName ?? "Demo client placeholder";
}

export function createClientListItems(
  clients: readonly ClientSummary[],
  matters: readonly MatterSummary[]
): readonly ClientListItem[] {
  return clients.map((client) => ({
    id: client.id,
    accountNumber: client.accountNumber,
    displayName: client.displayName,
    statusLabel: client.status,
    matterCountLabel: matterCountLabel(matters.filter((matter) => matter.clientId === client.id).length),
    latestStatementBalancePlaceholder: "Demo statement balance: R0.00 placeholder",
    paymentStatusPlaceholder: "Demo payment status: Lexpro remains source of truth",
    demoLabel: "Demo placeholder data"
  }));
}

export function createMatterListItems(
  matters: readonly MatterSummary[],
  clients: readonly ClientSummary[]
): readonly MatterListItem[] {
  return matters.map((matter) => ({
    id: matter.id,
    accountNumber: matter.accountNumber,
    clientDisplayName: findClientName(matter.clientId, clients),
    name: matter.name,
    description: matter.description,
    typeLabel: matter.type,
    statusLabel: matter.status,
    nextStepDueDateLabel: formatDate(matter.nextStepDueDate),
    responsibleUserPlaceholder: "Demo responsible user",
    latestInvoiceStatusPlaceholder: "Demo invoice status: not connected",
    latestStatementBalancePlaceholder: "Demo statement balance: R0.00 placeholder",
    lastCommunicationPlaceholder: "Demo last communication: not connected",
    paymentStatusPlaceholder: "Demo payment status: Lexpro remains source of truth",
    demoLabel: "Demo placeholder data"
  }));
}

export function createMatterDetailItem(
  matter: MatterSummary,
  clients: readonly ClientSummary[]
): MatterDetailItem {
  return {
    ...createMatterListItems([matter], clients)[0],
    futureActionsLabel: "Future phase only - no active edit, delete, send or approval actions"
  };
}
