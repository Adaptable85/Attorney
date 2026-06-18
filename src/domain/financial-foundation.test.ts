import { describe, expect, it } from "vitest";

import {
  defaultVatTreatmentForCategory,
  validateBillingLineItemInput
} from "./billing";
import { createFinancialCorrectionPayload } from "./financial-corrections";
import { buildOfficialInvoiceNumber, canAssignOfficialInvoiceNumber } from "./invoice-numbering";
import {
  approvedInvoiceChangesRequireCorrectionRecord,
  canApproveInvoice,
  canAssignInvoiceNumberBeforeApproval,
  canPrepareDraftInvoice,
  canSilentlyEditApprovedInvoice,
  createInvoiceApprovalPayload,
  validateDraftInvoiceInput
} from "./invoices";
import { centsToMajorUnitString, validateMoneyCents } from "./money";
import {
  createStatementApprovalPayload,
  statementSnapshotIsImmutableAfterApproval,
  validateStatementSnapshotInput
} from "./statements";

describe("financial domain foundation", () => {
  it("accepts integer cents and rejects floating point money", () => {
    expect(validateMoneyCents(185000)).toBe(185000);
    expect(centsToMajorUnitString(185000)).toBe("ZAR 1850.00");
    expect(() => validateMoneyCents(1850.75)).toThrow();
  });

  it("defaults fee categories to VAT on fees and disbursements to no VAT", () => {
    expect(defaultVatTreatmentForCategory("TIME")).toBe("VAT_ON_FEES");
    expect(defaultVatTreatmentForCategory("FOLIO")).toBe("VAT_ON_FEES");
    expect(defaultVatTreatmentForCategory("DISBURSEMENT")).toBe("NO_VAT");

    expect(
      validateBillingLineItemInput({
        matterId: "matter_1",
        description: "Consultation",
        category: "TIME",
        unitAmountCents: 185000,
        totalAmountCents: 185000
      }).vatTreatment
    ).toBe("VAT_ON_FEES");

    expect(
      validateBillingLineItemInput({
        matterId: "matter_1",
        description: "Sheriff fee",
        category: "DISBURSEMENT",
        unitAmountCents: 45000,
        totalAmountCents: 45000
      }).vatTreatment
    ).toBe("NO_VAT");
  });

  it("requires a reason for VAT overrides", () => {
    expect(() =>
      validateBillingLineItemInput({
        matterId: "matter_1",
        description: "Special fee",
        category: "TIME",
        unitAmountCents: 10000,
        totalAmountCents: 10000,
        vatTreatment: "NO_VAT"
      })
    ).toThrow("VAT override requires a reason");

    expect(
      validateBillingLineItemInput({
        matterId: "matter_1",
        description: "Special fee",
        category: "TIME",
        unitAmountCents: 10000,
        totalAmountCents: 10000,
        vatTreatment: "NO_VAT",
        vatOverrideReason: "Confirmed exempt treatment"
      }).vatTreatment
    ).toBe("NO_VAT");
  });

  it("keeps draft invoices without official invoice numbers", () => {
    const draft = validateDraftInvoiceInput({
      clientId: "client_1",
      matterId: "matter_1",
      internalDraftReference: "draft_001",
      subtotalCents: 10000,
      totalCents: 11500
    });

    expect(draft.officialInvoiceNumber).toBeUndefined();
    expect(draft.status).toBe("DRAFT");
    expect(() =>
      validateDraftInvoiceInput({
        clientId: "client_1",
        matterId: "matter_1",
        internalDraftReference: "draft_001",
        officialInvoiceNumber: "INV-00001",
        subtotalCents: 10000,
        totalCents: 11500
      } as never)
    ).toThrow();
  });

  it("allows owner approval to assign official invoice number payloads", () => {
    expect(canApproveInvoice("OWNER_PRINCIPAL")).toBe(true);
    expect(canAssignOfficialInvoiceNumber("OWNER_PRINCIPAL")).toBe(true);
    expect(buildOfficialInvoiceNumber("BA-", 12)).toBe("BA-00012");

    const approval = createInvoiceApprovalPayload({
      actorRole: "OWNER_PRINCIPAL",
      actorId: "owner_1",
      invoiceId: "invoice_1",
      currentStatus: "AWAITING_OWNER_APPROVAL",
      officialInvoiceNumber: "BA-00012"
    });

    expect(approval).toMatchObject({
      approvedStatus: "APPROVED",
      officialInvoiceNumber: "BA-00012",
      invoiceNumberAssignedById: "owner_1"
    });
  });

  it("blocks invoice approval and number assignment for non-owner roles", () => {
    expect(canPrepareDraftInvoice("SUPPORT_ADMIN")).toBe(true);
    expect(canApproveInvoice("SUPPORT_ADMIN")).toBe(false);
    expect(canApproveInvoice("AGENT_SERVICE")).toBe(false);
    expect(canAssignOfficialInvoiceNumber("AGENT_SERVICE")).toBe(false);
    expect(canAssignInvoiceNumberBeforeApproval()).toBe(false);
    expect(() => buildOfficialInvoiceNumber("BA-", 0)).toThrow(
      "Invoice number sequence value must be a positive integer"
    );

    expect(() =>
      createInvoiceApprovalPayload({
        actorRole: "SUPPORT_ADMIN",
        actorId: "support_1",
        invoiceId: "invoice_1",
        currentStatus: "AWAITING_OWNER_APPROVAL",
        officialInvoiceNumber: "BA-00013"
      })
    ).toThrow("Only owner/principal may approve invoices");

    expect(() =>
      createInvoiceApprovalPayload({
        actorRole: "OWNER_PRINCIPAL",
        actorId: "owner_1",
        invoiceId: "invoice_1",
        currentStatus: "DRAFT",
        officialInvoiceNumber: "BA-00013"
      })
    ).toThrow("Invoice number can only be assigned during owner approval");
  });

  it("requires correction records instead of silent approved invoice edits", () => {
    expect(canSilentlyEditApprovedInvoice()).toBe(false);
    expect(approvedInvoiceChangesRequireCorrectionRecord()).toBe(true);
  });

  it("validates statement snapshots and owner approval payloads", () => {
    expect(
      validateStatementSnapshotInput({
        clientId: "client_1",
        closingBalanceCents: 10000
      })
    ).toMatchObject({
      status: "DRAFT",
      openingBalanceCents: 0,
      closingBalanceCents: 10000
    });

    expect(statementSnapshotIsImmutableAfterApproval()).toBe(true);

    expect(
      createStatementApprovalPayload({
        actorRole: "OWNER_PRINCIPAL",
        actorId: "owner_1",
        statementSnapshotId: "statement_1",
        currentStatus: "AWAITING_OWNER_APPROVAL"
      })
    ).toMatchObject({
      approvedStatus: "APPROVED",
      approverId: "owner_1"
    });

    expect(() =>
      createStatementApprovalPayload({
        actorRole: "AGENT_SERVICE",
        actorId: "agent_1",
        statementSnapshotId: "statement_1",
        currentStatus: "AWAITING_OWNER_APPROVAL"
      })
    ).toThrow("Only owner/principal may approve statements");

    expect(() =>
      createStatementApprovalPayload({
        actorRole: "OWNER_PRINCIPAL",
        actorId: "owner_1",
        statementSnapshotId: "statement_1",
        currentStatus: "DRAFT"
      })
    ).toThrow("Statement must be awaiting owner approval");
  });

  it("creates financial correction payloads with actor, target, reason and type", () => {
    const correction = createFinancialCorrectionPayload({
      actorRole: "OWNER_PRINCIPAL",
      actorId: "owner_1",
      correctionType: "INVOICE_CORRECTION",
      targetRecordType: "invoice",
      targetRecordId: "invoice_1",
      reason: "Correct approved line item",
      amountDeltaCents: 5000
    });

    expect(correction).toMatchObject({
      actorId: "owner_1",
      correctionType: "INVOICE_CORRECTION",
      targetRecordType: "invoice",
      targetRecordId: "invoice_1",
      reason: "Correct approved line item"
    });

    expect(() =>
      createFinancialCorrectionPayload({
        actorRole: "AGENT_SERVICE",
        actorId: "agent_1",
        correctionType: "INVOICE_CORRECTION",
        targetRecordType: "invoice",
        targetRecordId: "invoice_1",
        reason: "Not allowed"
      })
    ).toThrow("Only owner/principal may create final financial corrections");
  });
});
