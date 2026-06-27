export type DemoMatterDocumentSummary = {
  name: string;
  status: string;
  category: string;
};

export type DemoMatterReviewRecord = {
  slug: string;
  title: string;
  referencePlaceholder: string;
  linkedClient: string;
  linkedClientSlug: string;
  matterType: string;
  status: string;
  priority: string;
  responsiblePersonPlaceholder: string;
  openedDatePlaceholder: string;
  nextKeyDatePlaceholder: string;
  documentStatus: string;
  communicationSummaryPlaceholder: string;
  billingSummaryPlaceholder: string;
  reviewNote: string;
  auditReviewNote: string;
  linkedDocuments: readonly DemoMatterDocumentSummary[];
};

export const demoMatterReviewRecords: readonly DemoMatterReviewRecord[] = [
  {
    slug: "demo-property-transfer",
    title: "Demo Property Transfer",
    referencePlaceholder: "DEMO-MATTER-PROP-001",
    linkedClient: "Demo Family Trust",
    linkedClientSlug: "demo-family-trust",
    matterType: "Property / conveyancing",
    status: "Awaiting client documents",
    priority: "High",
    responsiblePersonPlaceholder: "Demo conveyancing attorney",
    openedDatePlaceholder: "2026-06-01 placeholder",
    nextKeyDatePlaceholder: "Transfer document review placeholder",
    documentStatus: "Mandate and property documents partially received.",
    communicationSummaryPlaceholder: "Client follow-up summary placeholder only.",
    billingSummaryPlaceholder: "Transfer cost and statement context placeholder only.",
    reviewNote: "Review which conveyancing milestones Stephanie wants visible first.",
    auditReviewNote: "Future transfer milestone changes must capture actor and reason.",
    linkedDocuments: [
      {
        name: "Demo signed mandate",
        status: "Received",
        category: "Mandate / engagement"
      },
      {
        name: "Demo title deed copy",
        status: "Requested",
        category: "Property document"
      }
    ]
  },
  {
    slug: "demo-estate-planning",
    title: "Demo Estate Planning Review",
    referencePlaceholder: "DEMO-MATTER-EST-002",
    linkedClient: "Demo Family Trust",
    linkedClientSlug: "demo-family-trust",
    matterType: "Estate / trust",
    status: "Active",
    priority: "Medium",
    responsiblePersonPlaceholder: "Demo estate reviewer",
    openedDatePlaceholder: "2026-05-18 placeholder",
    nextKeyDatePlaceholder: "Trustee feedback placeholder",
    documentStatus: "Trust deed placeholder received; ID pack pending.",
    communicationSummaryPlaceholder: "Trustee review call summary placeholder only.",
    billingSummaryPlaceholder: "Estate planning statement context placeholder only.",
    reviewNote: "Review how trust/estate work should link client contacts and documents.",
    auditReviewNote: "Future trustee instruction updates require audit metadata.",
    linkedDocuments: [
      {
        name: "Demo trust deed extract",
        status: "Under review",
        category: "Trust / estate document"
      }
    ]
  },
  {
    slug: "demo-supply-agreement-review",
    title: "Demo Supply Agreement Review",
    referencePlaceholder: "DEMO-MATTER-COM-003",
    linkedClient: "Demo Kuils River Trading Pty Ltd",
    linkedClientSlug: "demo-kuils-river-company",
    matterType: "Commercial",
    status: "Drafting",
    priority: "Medium",
    responsiblePersonPlaceholder: "Demo commercial attorney",
    openedDatePlaceholder: "2026-06-10 placeholder",
    nextKeyDatePlaceholder: "Draft review placeholder",
    documentStatus: "Company registration and mandate placeholders pending.",
    communicationSummaryPlaceholder: "Director instruction summary placeholder only.",
    billingSummaryPlaceholder: "Commercial account context placeholder only.",
    reviewNote: "Confirm whether commercial clients need director/mandate status on matters.",
    auditReviewNote: "Future contract version changes should preserve review history.",
    linkedDocuments: [
      {
        name: "Demo company registration pack",
        status: "Missing information",
        category: "FICA / identity"
      }
    ]
  },
  {
    slug: "demo-dispute-response",
    title: "Demo Dispute Response",
    referencePlaceholder: "DEMO-MATTER-LIT-004",
    linkedClient: "Demo Individual Client",
    linkedClientSlug: "demo-individual-client",
    matterType: "Litigation / dispute",
    status: "Ready for review",
    priority: "High",
    responsiblePersonPlaceholder: "Demo dispute attorney",
    openedDatePlaceholder: "2026-06-12 placeholder",
    nextKeyDatePlaceholder: "Response deadline placeholder",
    documentStatus: "Court/dispute document placeholder ready for review.",
    communicationSummaryPlaceholder: "Draft client update summary placeholder only.",
    billingSummaryPlaceholder: "No invoice draft exists; review context placeholder only.",
    reviewNote: "Review which urgent dates should stand out in matter cards.",
    auditReviewNote: "Future deadline changes must be audit visible.",
    linkedDocuments: [
      {
        name: "Demo notice bundle",
        status: "Approved for file",
        category: "Court / dispute document"
      }
    ]
  },
  {
    slug: "demo-family-consultation",
    title: "Demo Family Consultation",
    referencePlaceholder: "DEMO-MATTER-FAM-005",
    linkedClient: "Demo Individual Client",
    linkedClientSlug: "demo-individual-client",
    matterType: "Family / personal",
    status: "New enquiry",
    priority: "Normal",
    responsiblePersonPlaceholder: "Demo intake reviewer",
    openedDatePlaceholder: "2026-06-20 placeholder",
    nextKeyDatePlaceholder: "Initial consultation placeholder",
    documentStatus: "No documents requested yet.",
    communicationSummaryPlaceholder: "Initial enquiry summary placeholder only.",
    billingSummaryPlaceholder: "No statement context yet.",
    reviewNote: "Review what minimum fields are needed before opening a personal matter.",
    auditReviewNote: "Future conversion from enquiry to active matter should be logged.",
    linkedDocuments: [
      {
        name: "Demo intake note",
        status: "Requested",
        category: "Internal note"
      }
    ]
  },
  {
    slug: "demo-general-advice",
    title: "Demo General Advice Matter",
    referencePlaceholder: "DEMO-MATTER-GEN-006",
    linkedClient: "Demo Repeat Commercial Client",
    linkedClientSlug: "demo-repeat-commercial-client",
    matterType: "General consultation",
    status: "Closed",
    priority: "Low",
    responsiblePersonPlaceholder: "Demo relationship owner",
    openedDatePlaceholder: "2026-03-04 placeholder",
    nextKeyDatePlaceholder: "No upcoming date placeholder",
    documentStatus: "Archived correspondence placeholder only.",
    communicationSummaryPlaceholder: "Closure summary placeholder only.",
    billingSummaryPlaceholder: "Historic statement context placeholder only.",
    reviewNote: "Review whether closed matters should remain prominent or searchable only.",
    auditReviewNote: "Future reopening should require reason capture.",
    linkedDocuments: [
      {
        name: "Demo closure correspondence",
        status: "Archived",
        category: "Correspondence"
      }
    ]
  }
] as const;

export const matterReviewPrompts = [
  "What matter types must Burgess support first?",
  "Which statuses match the real office workflow?",
  "Should every matter have a responsible person?",
  "Which dates are critical?",
  "Should matters show missing documents?",
  "Should billing/statement context appear on the matter?",
  "Who may view matters?",
  "Who may eventually create, update, or close matters?",
  "What should happen before a matter can be closed?"
] as const;

export const matterFutureWorkflowSteps = [
  "New matter opened",
  "Client and matter type confirmed",
  "Critical dates captured",
  "Documents requested and tracked",
  "Notes and client communication logged",
  "Billing/statement context reviewed where applicable",
  "Audit trail records all changes"
] as const;

export const disabledMatterFutureActions = [
  "Add matter",
  "Edit matter",
  "Close matter",
  "Link client",
  "Add note",
  "Upload document",
  "Draft invoice/statement",
  "Request approval",
  "View audit history"
] as const;

export function getDemoMatterReviewRecord(slug: string): DemoMatterReviewRecord | null {
  return demoMatterReviewRecords.find((matter) => matter.slug === slug) ?? null;
}
