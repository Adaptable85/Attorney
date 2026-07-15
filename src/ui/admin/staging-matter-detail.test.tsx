import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { StagingMatterDetail } from "./staging-matter-detail";

const baseMatter = {
  id: "matter_1",
  clientId: "client_1",
  clientDisplayName: "TEST Client File - Delete Later",
  accountNumber: "TEST-MATTER-001",
  name: "TEST Matter - Delete Later",
  description: "Staging test matter",
  type: "OTHER" as const,
  status: "OPEN" as const,
  nextStepDueDate: new Date("2026-07-30T00:00:00.000Z"),
  updatedAt: new Date("2026-07-15T09:00:00.000Z")
};

const billingLines = [{
  id: "billing_line_1",
  matterId: "matter_1",
  description: "Consultation",
  category: "TIME" as const,
  status: "DRAFT" as const,
  quantity: 1,
  unitAmountCents: 85000,
  totalAmountCents: 85000,
  currency: "ZAR",
  vatTreatment: "VAT_ON_FEES" as const,
  vatAmountCents: 12750,
  createdAt: new Date("2026-07-15T09:00:00.000Z")
}];

const draftInvoices = [{
  id: "invoice_1",
  clientId: "client_1",
  matterId: "matter_1",
  internalDraftReference: "DRAFT-TEST-MATTER-001-20260715-ABC123",
  officialInvoiceNumber: null,
  status: "DRAFT" as const,
  subtotalCents: 85000,
  vatAmountCents: 12750,
  totalCents: 97750,
  currency: "ZAR",
  createdAt: new Date("2026-07-15T09:30:00.000Z"),
  lines: [{
    id: "invoice_line_1",
    description: "Consultation",
    totalAmountCents: 85000,
    vatAmountCents: 12750
  }]
}];

describe("staging matter detail", () => {
  it("renders a staging matter workspace with document and timeline controls", () => {
    const html = renderToStaticMarkup(
      <StagingMatterDetail
        matter={baseMatter}
        documents={[{
          id: "document_1",
          filename: "TEST_Matter_File.pdf",
          documentType: "Saved matter document",
          matterReference: null,
          documentDate: null,
          contentType: "application/pdf",
          sizeBytes: 2048,
          status: "ACTIVE",
          createdAt: new Date("2026-07-15T09:00:00.000Z")
        }]}
        timeline={[{
          id: "timeline_1",
          eventType: "MATTER_NOTE_ADDED",
          subjectType: "matter_note",
          subjectId: "note_1",
          summary: "Consultation held",
          metadata: {
            eventDate: "2026-07-15",
            body: "Client gave test instructions."
          },
          createdAt: new Date("2026-07-15T10:00:00.000Z")
        }]}
        billingLines={billingLines}
        draftInvoices={draftInvoices}
        documentUploadsEnabled={true}
        matterWritesEnabled={true}
        matterInvoicesEnabled={true}
        documentUploaded={true}
        timelineAdded={true}
        billingLineAdded={true}
        invoiceCreated={true}
      />
    );

    expect(html).toContain("Live staging matter");
    expect(html).toContain("TEST Matter - Delete Later");
    expect(html).toContain("/admin/clients/client_1");
    expect(html).toContain("2026-07-30");
    expect(html).toContain("Staging matter document upload form");
    expect(html).toContain("compact-admin-form");
    expect(html).toContain("Matter Documents");
    expect(html).toContain("Use this only for documents related to this specific matter.");
    expect(html).toContain("Name what the file is, for example ID document");
    expect(html).toContain("Matter/reference label");
    expect(html).toContain("Upload a small test file only.");
    expect(html).toContain("Upload Matter Document");
    expect(html).toContain("TEST_Matter_File.pdf");
    expect(html).toContain("/admin/matters/matter_1/documents/document_1/view");
    expect(html).toContain("/admin/matters/matter_1/documents/document_1/download");
    expect(html).toContain("Notes / Voice Notes");
    expect(html).toContain("Matter Notes / Voice Notes");
    expect(html).toContain("Staging matter notes and voice-note summary form");
    expect(html).toContain("Type the details for this matter.");
    expect(html).toContain("Audio upload and automatic transcription are not active yet.");
    expect(html).toContain("Add Matter Note");
    expect(html).toContain("Consultation held");
    expect(html).toContain("Billing Items");
    expect(html).toContain("Staging matter billing line form");
    expect(html).toContain("Add Draft Billing Line");
    expect(html).toContain("Draft billing line added to this matter.");
    expect(html).toContain("Draft Invoices");
    expect(html).toContain("Create Draft Invoice");
    expect(html).toContain("DRAFT-TEST-MATTER-001-20260715-ABC123");
    expect(html).toContain("Not assigned");
    expect(html).toContain("Draft invoice created and pulled into the client statement.");
    expect(html).toContain("Statement Link");
    expect(html).toContain("/admin/clients/client_1#statements");
    expect(html).not.toContain("Approve invoice");
    expect(html).not.toContain("Send statement");
    expect(html).not.toContain("Official invoice number");
  });

  it("renders safe fallbacks for missing optional matter fields", () => {
    const html = renderToStaticMarkup(
      <StagingMatterDetail
        matter={{
          ...baseMatter,
          clientDisplayName: null,
          nextStepDueDate: null,
        }}
        documents={[]}
        timeline={[]}
        billingLines={[]}
        draftInvoices={[]}
        documentUploadsEnabled={false}
        matterWritesEnabled={false}
        matterInvoicesEnabled={false}
        documentError="Document gate test error"
        timelineError="Timeline gate test error"
        billingError="Billing gate test error"
        invoiceError="Invoice gate test error"
      />
    );

    expect(html).toContain("Saved client");
    expect(html).toContain("Not set");
    expect(html).toContain("Document upload unavailable");
    expect(html).toContain("Matter notes unavailable");
    expect(html).toContain("Matter invoice gate off");
    expect(html).toContain("Draft invoice action unavailable.");
    expect(html).toContain("Document gate test error");
    expect(html).toContain("Timeline gate test error");
    expect(html).toContain("Billing gate test error");
    expect(html).toContain("Invoice gate test error");
  });

  it("renders matter document and timeline fallback values", () => {
    const html = renderToStaticMarkup(
      <StagingMatterDetail
        matter={baseMatter}
        documents={[{
          id: "document_1",
          filename: "Tiny.txt",
          documentType: "Saved matter document",
          matterReference: null,
          documentDate: null,
          contentType: "text/plain",
          sizeBytes: 512,
          status: "ACTIVE",
          createdAt: new Date("2026-07-15T09:00:00.000Z")
        }, {
          id: "document_2",
          filename: "Unknown-size.txt",
          documentType: "Saved matter document",
          matterReference: null,
          documentDate: null,
          contentType: "text/plain",
          sizeBytes: null,
          status: "ACTIVE",
          createdAt: new Date("2026-07-16T09:00:00.000Z")
        }]}
        timeline={[{
          id: "timeline_1",
          eventType: "DOCUMENT_UPLOADED",
          subjectType: "document",
          subjectId: "document_1",
          summary: "Uploaded matter document",
          metadata: null,
          createdAt: new Date("2026-07-15T10:00:00.000Z")
        }, {
          id: "timeline_2",
          eventType: "MATTER_NOTE_ADDED",
          subjectType: "matter_note",
          subjectId: "note_1",
          summary: "Empty metadata note",
          metadata: {
            eventDate: "",
            body: ""
          },
          createdAt: new Date("2026-07-16T10:00:00.000Z")
        }]}
        billingLines={[]}
        draftInvoices={[]}
        documentUploadsEnabled={true}
        matterWritesEnabled={true}
        matterInvoicesEnabled={false}
      />
    );

    expect(html).toContain("512 bytes");
    expect(html).toContain("Unknown");
    expect(html).toContain("2026-07-15");
    expect(html).toContain("2026-07-16");
    expect(html).toContain("document uploaded");
  });
});
