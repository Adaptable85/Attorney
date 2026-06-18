import { z } from "zod";

import { moneyCentsSchema, currencySchema } from "./money";
import {
  canApproveInvoices,
  canCreateDraftLineItems
} from "./permission-policy";
import type { RoleKey } from "./roles";

export const invoiceStatuses = [
  "DRAFT",
  "AWAITING_OWNER_APPROVAL",
  "APPROVED",
  "SENT",
  "CANCELLED",
  "CORRECTED",
  "PAID",
  "PART_PAID",
  "OVERDUE"
] as const;

export type InvoiceStatus = (typeof invoiceStatuses)[number];

export const draftInvoiceInputSchema = z.object({
  clientId: z.string().trim().min(1),
  matterId: z.string().trim().min(1),
  internalDraftReference: z.string().trim().min(1),
  officialInvoiceNumber: z.undefined().optional(),
  status: z.literal("DRAFT").default("DRAFT"),
  subtotalCents: moneyCentsSchema,
  vatAmountCents: moneyCentsSchema.default(0),
  totalCents: moneyCentsSchema,
  currency: currencySchema
});

export type DraftInvoiceInput = z.input<typeof draftInvoiceInputSchema>;
export type ValidatedDraftInvoice = z.output<typeof draftInvoiceInputSchema>;

export type InvoiceApprovalInput = {
  actorRole: RoleKey;
  actorId: string;
  invoiceId: string;
  currentStatus: InvoiceStatus;
  officialInvoiceNumber: string;
};

export function validateDraftInvoiceInput(input: DraftInvoiceInput): ValidatedDraftInvoice {
  return draftInvoiceInputSchema.parse(input);
}

export function canPrepareDraftInvoice(role: RoleKey): boolean {
  return canCreateDraftLineItems(role);
}

export function canApproveInvoice(role: RoleKey): boolean {
  return canApproveInvoices(role);
}

export function createInvoiceApprovalPayload(input: InvoiceApprovalInput) {
  if (!canApproveInvoices(input.actorRole)) {
    throw new Error("Only owner/principal may approve invoices");
  }

  if (input.currentStatus !== "AWAITING_OWNER_APPROVAL") {
    throw new Error("Invoice number can only be assigned during owner approval");
  }

  return {
    invoiceId: input.invoiceId,
    approverId: input.actorId,
    approvedStatus: "APPROVED" as const,
    officialInvoiceNumber: input.officialInvoiceNumber,
    invoiceNumberAssignedById: input.actorId
  };
}

export function canAssignInvoiceNumberBeforeApproval(): false {
  return false;
}

export function canSilentlyEditApprovedInvoice(): false {
  return false;
}

export function approvedInvoiceChangesRequireCorrectionRecord(): true {
  return true;
}
