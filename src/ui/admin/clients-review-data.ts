export type DemoClientMatterSummary = {
  name: string;
  status: string;
  context: string;
};

export type DemoClientReviewRecord = {
  slug: string;
  displayName: string;
  clientType: string;
  contactPerson: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  matterCount: number;
  openMatterCount: number;
  status: "Active" | "New enquiry" | "Dormant" | "Archived candidate" | "Awaiting documents";
  lastActivityNote: string;
  relationshipNote: string;
  responsiblePersonPlaceholder: string;
  documentStatusSummary: string;
  billingSummaryPlaceholder: string;
  auditReviewNote: string;
  linkedMatters: readonly DemoClientMatterSummary[];
};

export const demoClientReviewRecords: readonly DemoClientReviewRecord[] = [
  {
    slug: "demo-family-trust",
    displayName: "Demo Family Trust",
    clientType: "Trust / estate",
    contactPerson: "Demo Trustee Contact",
    emailPlaceholder: "trust.contact@example.test",
    phonePlaceholder: "+27 21 000 0101",
    matterCount: 3,
    openMatterCount: 2,
    status: "Active",
    lastActivityNote: "Review whether trust and estate clients need separate contact roles.",
    relationshipNote: "Long-running family relationship with recurring property and estate work.",
    responsiblePersonPlaceholder: "Demo responsible attorney",
    documentStatusSummary: "Trust deed and ID document placeholders would be tracked here.",
    billingSummaryPlaceholder: "Statement context placeholder only; Lexpro remains source of truth.",
    auditReviewNote: "Future changes to trustee/contact details must be audit logged.",
    linkedMatters: [
      {
        name: "Demo estate planning review",
        status: "Open",
        context: "Illustrates multi-matter history for one client record."
      },
      {
        name: "Demo property transfer",
        status: "Waiting on client",
        context: "Shows a document-request state without uploads."
      }
    ]
  },
  {
    slug: "demo-kuils-river-company",
    displayName: "Demo Kuils River Trading Pty Ltd",
    clientType: "Company",
    contactPerson: "Demo Operations Director",
    emailPlaceholder: "company.contact@example.test",
    phonePlaceholder: "+27 21 000 0102",
    matterCount: 5,
    openMatterCount: 1,
    status: "Awaiting documents",
    lastActivityNote: "Confirm which company registration and resolution fields must be visible.",
    relationshipNote: "Repeat commercial client with contract and collection-related enquiries.",
    responsiblePersonPlaceholder: "Demo support admin",
    documentStatusSummary: "Company registration, director IDs and mandate placeholders pending.",
    billingSummaryPlaceholder: "Commercial account summary placeholder only; no write action.",
    auditReviewNote: "Future director/contact changes should require reason capture.",
    linkedMatters: [
      {
        name: "Demo supply agreement review",
        status: "Open",
        context: "Shows a commercial matter linked to an organisation client."
      }
    ]
  },
  {
    slug: "demo-individual-client",
    displayName: "Demo Individual Client",
    clientType: "Individual",
    contactPerson: "Demo Individual Client",
    emailPlaceholder: "individual.client@example.test",
    phonePlaceholder: "+27 21 000 0103",
    matterCount: 1,
    openMatterCount: 1,
    status: "New enquiry",
    lastActivityNote: "Review which intake fields are mandatory before a matter is opened.",
    relationshipNote: "New enquiry for a once-off personal legal matter.",
    responsiblePersonPlaceholder: "Demo intake reviewer",
    documentStatusSummary: "ID and proof-of-address placeholders not requested yet.",
    billingSummaryPlaceholder: "No statement context yet; future summary remains read-only.",
    auditReviewNote: "Future conversion from enquiry to active client should be audit logged.",
    linkedMatters: [
      {
        name: "Demo consultation enquiry",
        status: "New",
        context: "Shows an initial enquiry before formal matter opening."
      }
    ]
  },
  {
    slug: "demo-repeat-commercial-client",
    displayName: "Demo Repeat Commercial Client",
    clientType: "Repeat / commercial",
    contactPerson: "Demo Finance Contact",
    emailPlaceholder: "accounts.contact@example.test",
    phonePlaceholder: "+27 21 000 0104",
    matterCount: 8,
    openMatterCount: 0,
    status: "Dormant",
    lastActivityNote: "Consider whether dormant repeat clients should remain searchable.",
    relationshipNote: "Past commercial client with several closed matters and future potential work.",
    responsiblePersonPlaceholder: "Demo relationship owner",
    documentStatusSummary: "Historic mandate placeholders would remain private by default.",
    billingSummaryPlaceholder: "Closed account context placeholder only; no collection workflow.",
    auditReviewNote: "Future reactivation should show who changed the client status.",
    linkedMatters: [
      {
        name: "Demo completed contract review",
        status: "Closed",
        context: "Shows closed matter history without write access."
      },
      {
        name: "Demo completed advisory matter",
        status: "Closed",
        context: "Illustrates repeat-client history for review."
      }
    ]
  },
  {
    slug: "demo-archived-candidate",
    displayName: "Demo Archived Candidate",
    clientType: "Individual",
    contactPerson: "Demo Former Client",
    emailPlaceholder: "former.client@example.test",
    phonePlaceholder: "+27 21 000 0105",
    matterCount: 2,
    openMatterCount: 0,
    status: "Archived candidate",
    lastActivityNote: "Review whether archived clients should be hidden by default or searchable.",
    relationshipNote: "Former client record used to discuss archive/search rules.",
    responsiblePersonPlaceholder: "Demo archive reviewer",
    documentStatusSummary: "Historic document metadata placeholder; no document access is active.",
    billingSummaryPlaceholder: "Historic statement context placeholder only.",
    auditReviewNote: "Future archive action must require approval and audit metadata.",
    linkedMatters: [
      {
        name: "Demo closed family matter",
        status: "Closed",
        context: "Shows archival review without deletion."
      }
    ]
  }
];

export const clientReviewPrompts = [
  "Should Burgess manage both individuals and organisations as clients?",
  "Which client types should be supported?",
  "What statuses should be used?",
  "Which contact fields are mandatory?",
  "Should each client show linked matters?",
  "Should billing/statement summary appear on the client record?",
  "What relationship/context notes should be captured?",
  "Who at Burgess may view client records?",
  "Who may eventually create or edit client records?",
  "Should archived clients remain searchable?"
] as const;

export const clientFutureWorkflowSteps = [
  "New client captured",
  "Conflict/basic duplicate check",
  "Matter linked",
  "Documents requested",
  "Notes and activity logged",
  "Statement/invoice context displayed where applicable",
  "Audit trail records all changes"
] as const;

export const disabledClientFutureActions = [
  "Add client",
  "Edit client",
  "Archive client",
  "Link matter",
  "Add note",
  "Upload document",
  "Generate statement",
  "View audit history"
] as const;

export function getDemoClientReviewRecord(slug: string): DemoClientReviewRecord | null {
  return demoClientReviewRecords.find((client) => client.slug === slug) ?? null;
}
