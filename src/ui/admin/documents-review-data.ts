export type DemoDocumentReviewRecord = {
  slug: string;
  name: string;
  category: string;
  linkedClient: string;
  linkedClientSlug: string;
  linkedMatter: string;
  linkedMatterSlug: string;
  status: string;
  lastReviewedPlaceholder: string;
  requiredFlag: "Required" | "Optional";
  confidentialityMarker: string;
  metadataSummary: string;
  storageBoundary: string;
  reviewNote: string;
  auditReviewNote: string;
};

export const demoDocumentReviewRecords: readonly DemoDocumentReviewRecord[] = [
  {
    slug: "demo-fica-pack",
    name: "Demo FICA Identity Pack",
    category: "FICA / identity",
    linkedClient: "Demo Individual Client",
    linkedClientSlug: "demo-individual-client",
    linkedMatter: "Demo Family Consultation",
    linkedMatterSlug: "demo-family-consultation",
    status: "Requested",
    lastReviewedPlaceholder: "Not reviewed yet",
    requiredFlag: "Required",
    confidentialityMarker: "Private client identity metadata",
    metadataSummary: "Placeholder for ID and proof-of-address tracking only.",
    storageBoundary: "No file storage, upload or download is enabled.",
    reviewNote: "Confirm which identity documents are mandatory for intake.",
    auditReviewNote: "Future document access must record actor, role and timestamp."
  },
  {
    slug: "demo-signed-mandate",
    name: "Demo Signed Mandate",
    category: "Mandate / engagement",
    linkedClient: "Demo Family Trust",
    linkedClientSlug: "demo-family-trust",
    linkedMatter: "Demo Property Transfer",
    linkedMatterSlug: "demo-property-transfer",
    status: "Received",
    lastReviewedPlaceholder: "2026-06-14 placeholder",
    requiredFlag: "Required",
    confidentialityMarker: "Private engagement metadata",
    metadataSummary: "Tracks mandate status without exposing file content.",
    storageBoundary: "No file body, storage key or download URL exists.",
    reviewNote: "Confirm mandate naming and review labels for property work.",
    auditReviewNote: "Future replacement must keep prior metadata visible through audit."
  },
  {
    slug: "demo-title-deed-copy",
    name: "Demo Title Deed Copy",
    category: "Property document",
    linkedClient: "Demo Family Trust",
    linkedClientSlug: "demo-family-trust",
    linkedMatter: "Demo Property Transfer",
    linkedMatterSlug: "demo-property-transfer",
    status: "Missing information",
    lastReviewedPlaceholder: "Pending review",
    requiredFlag: "Required",
    confidentialityMarker: "Private property metadata",
    metadataSummary: "Placeholder for property document completeness tracking.",
    storageBoundary: "No upload/download/storage workflow is active.",
    reviewNote: "Review whether missing property documents should surface on matter cards.",
    auditReviewNote: "Future missing-document status changes must be audit logged."
  },
  {
    slug: "demo-notice-bundle",
    name: "Demo Notice Bundle",
    category: "Court / dispute document",
    linkedClient: "Demo Individual Client",
    linkedClientSlug: "demo-individual-client",
    linkedMatter: "Demo Dispute Response",
    linkedMatterSlug: "demo-dispute-response",
    status: "Approved for file",
    lastReviewedPlaceholder: "2026-06-21 placeholder",
    requiredFlag: "Required",
    confidentialityMarker: "Confidential dispute metadata",
    metadataSummary: "Placeholder for received notice and supporting bundle metadata.",
    storageBoundary: "No court document file can be opened or downloaded.",
    reviewNote: "Confirm which dispute documents need urgent review flags.",
    auditReviewNote: "Future approval for file should capture reviewer and reason."
  },
  {
    slug: "demo-trust-deed-extract",
    name: "Demo Trust Deed Extract",
    category: "Trust / estate document",
    linkedClient: "Demo Family Trust",
    linkedClientSlug: "demo-family-trust",
    linkedMatter: "Demo Estate Planning Review",
    linkedMatterSlug: "demo-estate-planning",
    status: "Under review",
    lastReviewedPlaceholder: "2026-06-18 placeholder",
    requiredFlag: "Required",
    confidentialityMarker: "Private trust metadata",
    metadataSummary: "Placeholder for trust deed review status only.",
    storageBoundary: "No trust deed file content is stored in this phase.",
    reviewNote: "Review trust/estate document categories with Stephanie.",
    auditReviewNote: "Future trustee-sensitive access should be audit visible."
  },
  {
    slug: "demo-client-correspondence",
    name: "Demo Client Correspondence",
    category: "Correspondence",
    linkedClient: "Demo Kuils River Trading Pty Ltd",
    linkedClientSlug: "demo-kuils-river-company",
    linkedMatter: "Demo Supply Agreement Review",
    linkedMatterSlug: "demo-supply-agreement-review",
    status: "Received",
    lastReviewedPlaceholder: "2026-06-22 placeholder",
    requiredFlag: "Optional",
    confidentialityMarker: "Private communication metadata",
    metadataSummary: "Placeholder for correspondence category and review status.",
    storageBoundary: "No email/file attachment storage is connected.",
    reviewNote: "Review whether correspondence should live under client, matter or both.",
    auditReviewNote: "Future correspondence access should record viewer and purpose."
  },
  {
    slug: "demo-statement-record",
    name: "Demo Statement Record Metadata",
    category: "Invoice / statement record",
    linkedClient: "Demo Repeat Commercial Client",
    linkedClientSlug: "demo-repeat-commercial-client",
    linkedMatter: "Demo General Advice Matter",
    linkedMatterSlug: "demo-general-advice",
    status: "Archived",
    lastReviewedPlaceholder: "Historic placeholder",
    requiredFlag: "Optional",
    confidentialityMarker: "Private financial metadata",
    metadataSummary: "Statement metadata placeholder only; no statement workflow is live.",
    storageBoundary: "No statement PDF generation, storage or download is enabled.",
    reviewNote: "Review whether financial document metadata should appear in documents.",
    auditReviewNote: "Future statement records require owner/principal approval boundaries."
  }
] as const;

export const documentReviewPrompts = [
  "Which document categories are required first?",
  "Which documents belong to clients versus matters?",
  "Who may upload documents later?",
  "Who may view confidential documents?",
  "Which documents must be mandatory?",
  "Should missing documents appear on client and matter pages?",
  "What should the audit trail record for documents?",
  "Should documents ever be deleted, or only archived?"
] as const;

export const disabledDocumentFutureActions = [
  "Upload document",
  "Replace document",
  "Download document",
  "Link to matter",
  "Mark reviewed",
  "Archive document",
  "View audit history"
] as const;

export function getDemoDocumentReviewRecord(slug: string): DemoDocumentReviewRecord | null {
  return demoDocumentReviewRecords.find((document) => document.slug === slug) ?? null;
}
