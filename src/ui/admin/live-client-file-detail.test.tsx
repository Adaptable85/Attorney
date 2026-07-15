import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LiveClientFileDetail } from "./live-client-file-detail";

describe("live client file detail", () => {
  const client = {
    id: "client_test_1",
    accountNumber: "TEST-001",
    displayName: "TEST Client File - Delete Later",
    status: "ACTIVE" as const,
    updatedAt: new Date("2026-07-15T09:00:00.000Z"),
    primaryContactName: "Test Contact",
    primaryContactEmail: "test@example.test",
    primaryContactPhone: "+27 00 000 0000"
  };
  const billingItems = [
    {
      id: "billing_template_1",
      label: "Consultation",
      category: "TIME" as const,
      description: "Consultation item",
      amountCents: 85000,
      currency: "ZAR",
      vatTreatment: "VAT_ON_FEES" as const,
      status: "ACTIVE" as const,
      updatedAt: new Date("2026-07-15T09:00:00.000Z")
    }
  ];
  const matters = [
    {
      id: "matter_1",
      clientId: "client_test_1",
      clientDisplayName: "TEST Client File - Delete Later",
      accountNumber: "TEST-MATTER-001",
      name: "TEST Matter - Delete Later",
      description: "Staging matter test",
      type: "OTHER" as const,
      status: "OPEN" as const,
      nextStepDueDate: null,
      updatedAt: new Date("2026-07-15T09:00:00.000Z")
    }
  ];

  it("renders saved staging client details with clickable panels and gated upload form", () => {
    const html = renderToStaticMarkup(
      <LiveClientFileDetail
        client={client}
        matters={matters}
        documents={[]}
        billingItems={billingItems}
        matterWritesEnabled={true}
        documentUploadsEnabled={true}
        billingItemsEnabled={true}
        uploaded={false}
        matterCreated={true}
      />
    );

    expect(html).toContain("Live staging client file");
    expect(html).toContain("TEST Client File - Delete Later");
    expect(html).toContain("TEST-001");
    expect(html).toContain("Test Contact");
    expect(html).toContain("href=\"#documents\"");
    expect(html).toContain("Staging matter creation enabled");
    expect(html).toContain("Open New Matter");
    expect(html).toContain("/admin/clients/client_test_1/matters/new");
    expect(html).toContain("TEST Matter - Delete Later");
    expect(html).toContain("/admin/matters/matter_1");
    expect(html).toContain("Staging matter opened and added to this client file.");
    expect(html).toContain("Test document upload enabled");
    expect(html).toContain("Staging document upload form");
    expect(html).toContain("compact-admin-form");
    expect(html).toContain("Describe the file, for example identity document");
    expect(html).toContain("Upload one small staging file.");
    expect(html).toContain("Upload Test Document");
    expect(html).toContain("Suggested format: ClientName_MatterName_DocumentType_Date");
    expect(html).toContain("Consultation");
    expect(html).toContain("Edit list");
    expect(html).toContain("LLM note processing unavailable");
    expect(html).toContain("Invoice approval unavailable");
    expect(html).toContain("Statement sending unavailable");
    expect(html).not.toContain("Assign invoice number");
    expect(html).not.toContain("Send statement");
  });

  it("renders pending contact details when a saved client has no primary contact", () => {
    const html = renderToStaticMarkup(
      <LiveClientFileDetail
        client={{
          ...client,
          primaryContactName: null,
          primaryContactEmail: null,
          primaryContactPhone: null
        }}
        matters={[]}
        documents={[]}
        billingItems={[]}
        matterWritesEnabled={false}
        documentUploadsEnabled={false}
        billingItemsEnabled={false}
        uploaded={false}
      />
    );

    expect(html).toContain("No contact saved");
    expect(html).toContain("No email saved");
    expect(html).toContain("No phone saved");
    expect(html).toContain("Matter gate off");
    expect(html).toContain("Upload gate off");
  });

  it("renders uploaded document and upload error states", () => {
    const html = renderToStaticMarkup(
      <LiveClientFileDetail
        client={client}
        matters={[]}
        documents={[
          {
            id: "document_1",
            filename: "TEST_Client_General_Identity_2026_07_15.txt",
            documentType: "Identity",
            matterReference: "General",
            documentDate: "2026-07-15",
            contentType: "text/plain",
            sizeBytes: null,
            status: "ACTIVE",
            createdAt: new Date("2026-07-15T09:00:00.000Z")
          }
        ]}
        billingItems={[]}
        matterWritesEnabled={false}
        documentUploadsEnabled={true}
        billingItemsEnabled={false}
        uploaded={true}
        uploadError="Upload test error"
      />
    );

    expect(html).toContain("Test document uploaded and added to this client file.");
    expect(html).toContain("Document not uploaded.");
    expect(html).toContain("Upload test error");
    expect(html).toContain("TEST_Client_General_Identity_2026_07_15.txt");
    expect(html).toContain("0 bytes");
    expect(html).toContain("/admin/clients/client_test_1/documents/document_1/view");
    expect(html).toContain("/admin/clients/client_test_1/documents/document_1/download");
    expect(html).toContain("View");
    expect(html).toContain("Download");
    expect(html).toContain("Billing item edit gate off.");
  });
});
