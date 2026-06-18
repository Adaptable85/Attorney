import { validateBillingLineItemInput } from "@/domain/billing";
import { validateDraftInvoiceInput } from "@/domain/invoices";
import { validateStatementSnapshotInput } from "@/domain/statements";
import { fakeClient } from "./clients";
import { fakeMatter } from "./matters";

export const fakeBillingLineItem = validateBillingLineItemInput({
  matterId: fakeMatter.id,
  description: "Fake consultation line item",
  category: "TIME",
  unitAmountCents: 185000,
  totalAmountCents: 185000
});

export const fakeDraftInvoice = validateDraftInvoiceInput({
  clientId: fakeClient.id,
  matterId: fakeMatter.id,
  internalDraftReference: "DRAFT-DEMO-001",
  subtotalCents: 185000,
  vatAmountCents: 27750,
  totalCents: 212750
});

export const fakeApprovedInvoice = {
  ...fakeDraftInvoice,
  status: "APPROVED" as const,
  officialInvoiceNumber: "DEMO-INV-00001"
};

export const fakeStatementSnapshot = validateStatementSnapshotInput({
  clientId: fakeClient.id,
  matterId: fakeMatter.id,
  openingBalanceCents: 0,
  closingBalanceCents: 212750
});

