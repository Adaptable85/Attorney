export type DemoClientMatterSummary = {
  name: string;
  status: string;
  context: string;
};

export type DemoClientFileDocument = {
  name: string;
  category: string;
  matterName: string;
  status: string;
  suggestedFilename: string;
};

export type DemoClientFileNote = {
  source: "Text note" | "Voice note";
  title: string;
  linkedMatter: string;
  status: string;
  agentDraftUse: string;
};

export type DemoClientFileBillingDraft = {
  title: string;
  sourceNote: string;
  status: string;
  amountPlaceholder: string;
  approvalState: string;
};

export type DemoClientFileStatementDraft = {
  title: string;
  status: string;
  summary: string;
  approvalState: string;
};

export type DemoClientFileAuditItem = {
  event: string;
  actor: string;
  result: string;
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
  fileDocuments: readonly DemoClientFileDocument[];
  fileNotes: readonly DemoClientFileNote[];
  billingDrafts: readonly DemoClientFileBillingDraft[];
  statementDrafts: readonly DemoClientFileStatementDraft[];
  auditItems: readonly DemoClientFileAuditItem[];
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
    ],
    fileDocuments: [
      {
        name: "Demo Signed Mandate",
        category: "Mandate",
        matterName: "Demo property transfer",
        status: "Metadata only",
        suggestedFilename: "Demo_Family_Trust_Demo_Property_Transfer_Mandate_2026-06-18"
      },
      {
        name: "Trust deed placeholder",
        category: "FICA / trust",
        matterName: "Demo estate planning review",
        status: "Requested",
        suggestedFilename: "Demo_Family_Trust_Demo_Estate_Planning_Review_Trust_Deed_2026-06-18"
      }
    ],
    fileNotes: [
      {
        source: "Voice note",
        title: "Transfer follow-up call summary",
        linkedMatter: "Demo property transfer",
        status: "Transcription placeholder",
        agentDraftUse: "May suggest draft transfer follow-up fee line only."
      },
      {
        source: "Text note",
        title: "Trustee document request",
        linkedMatter: "Demo estate planning review",
        status: "Review note only",
        agentDraftUse: "May inform statement narrative; cannot send to client."
      }
    ],
    billingDrafts: [
      {
        title: "Draft transfer correspondence line",
        sourceNote: "Transfer follow-up call summary",
        status: "AI draft suggestion only",
        amountPlaceholder: "R 650.00 placeholder",
        approvalState: "Not approved; no invoice number."
      },
      {
        title: "Draft trustee document review line",
        sourceNote: "Trustee document request",
        status: "Draft only",
        amountPlaceholder: "R 1,200.00 placeholder",
        approvalState: "Principal review required before invoice use."
      }
    ],
    statementDrafts: [
      {
        title: "Draft family trust statement summary",
        status: "Draft only",
        summary: "Groups open transfer and estate planning placeholders under one client file.",
        approvalState: "Not approved, not sent, no final statement."
      }
    ],
    auditItems: [
      {
        event: "Client file viewed",
        actor: "Read-Only Reviewer",
        result: "Review-only access"
      },
      {
        event: "Document naming suggested",
        actor: "System placeholder",
        result: "No file stored"
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
    ],
    fileDocuments: [
      {
        name: "Company resolution placeholder",
        category: "Authority",
        matterName: "Demo supply agreement review",
        status: "Requested",
        suggestedFilename: "Demo_Kuils_River_Trading_Demo_Supply_Agreement_Review_Resolution_2026-06-19"
      }
    ],
    fileNotes: [
      {
        source: "Text note",
        title: "Contract clauses to check",
        linkedMatter: "Demo supply agreement review",
        status: "Review note only",
        agentDraftUse: "May suggest draft review and correspondence billing lines."
      }
    ],
    billingDrafts: [
      {
        title: "Draft supply agreement review line",
        sourceNote: "Contract clauses to check",
        status: "AI draft suggestion only",
        amountPlaceholder: "R 2,500.00 placeholder",
        approvalState: "Not approved; no invoice number."
      }
    ],
    statementDrafts: [
      {
        title: "Draft commercial client statement summary",
        status: "Draft only",
        summary: "Shows matter-linked work in one client file before statement approval.",
        approvalState: "Not approved and not sent."
      }
    ],
    auditItems: [
      {
        event: "Commercial client file viewed",
        actor: "Read-Only Reviewer",
        result: "Review-only access"
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
    ],
    fileDocuments: [
      {
        name: "ID document placeholder",
        category: "FICA",
        matterName: "Demo consultation enquiry",
        status: "Not requested",
        suggestedFilename: "Demo_Individual_Client_Demo_Consultation_Enquiry_FICA_ID_2026-06-20"
      }
    ],
    fileNotes: [
      {
        source: "Voice note",
        title: "Initial consultation note",
        linkedMatter: "Demo consultation enquiry",
        status: "Transcription placeholder",
        agentDraftUse: "May suggest consultation draft line after review."
      }
    ],
    billingDrafts: [
      {
        title: "Draft consultation line",
        sourceNote: "Initial consultation note",
        status: "Draft only",
        amountPlaceholder: "R 850.00 placeholder",
        approvalState: "Not approved; no invoice number."
      }
    ],
    statementDrafts: [
      {
        title: "Draft consultation statement summary",
        status: "Draft only",
        summary: "Single-matter summary placeholder inside the client file.",
        approvalState: "Not approved and not sent."
      }
    ],
    auditItems: [
      {
        event: "New enquiry previewed",
        actor: "Read-Only Reviewer",
        result: "No client converted"
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
    ],
    fileDocuments: [
      {
        name: "Historic mandate placeholder",
        category: "Mandate",
        matterName: "Demo completed contract review",
        status: "Archived metadata",
        suggestedFilename: "Demo_Repeat_Commercial_Client_Completed_Contract_Review_Mandate_2026-06-21"
      }
    ],
    fileNotes: [
      {
        source: "Text note",
        title: "Dormant client review note",
        linkedMatter: "General client history",
        status: "Review note only",
        agentDraftUse: "No draft billing suggested while dormant."
      }
    ],
    billingDrafts: [
      {
        title: "Historic balance review placeholder",
        sourceNote: "Dormant client review note",
        status: "Review only",
        amountPlaceholder: "R 0.00 placeholder",
        approvalState: "No invoice action available."
      }
    ],
    statementDrafts: [
      {
        title: "Dormant account context",
        status: "Review only",
        summary: "Shows why dormant clients remain searchable before any reactivation.",
        approvalState: "Not approved and not sent."
      }
    ],
    auditItems: [
      {
        event: "Dormant client reviewed",
        actor: "Read-Only Reviewer",
        result: "No reactivation"
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
    ],
    fileDocuments: [
      {
        name: "Closed matter pack placeholder",
        category: "Archive",
        matterName: "Demo closed family matter",
        status: "Archived metadata",
        suggestedFilename: "Demo_Archived_Candidate_Demo_Closed_Family_Matter_Archive_Pack_2026-06-22"
      }
    ],
    fileNotes: [
      {
        source: "Text note",
        title: "Archive suitability note",
        linkedMatter: "Demo closed family matter",
        status: "Review note only",
        agentDraftUse: "No invoice suggestion; archive controls remain disabled."
      }
    ],
    billingDrafts: [
      {
        title: "Write-off review placeholder",
        sourceNote: "Archive suitability note",
        status: "Review only",
        amountPlaceholder: "R 950.00 placeholder",
        approvalState: "Principal approval required; no write-off action."
      }
    ],
    statementDrafts: [
      {
        title: "Archive statement context",
        status: "Review only",
        summary: "Shows historical balance context without collection workflow.",
        approvalState: "Not approved and not sent."
      }
    ],
    auditItems: [
      {
        event: "Archive candidate previewed",
        actor: "Read-Only Reviewer",
        result: "No archive mutation"
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
  "Create client file",
  "Edit client details",
  "Archive client file",
  "Open live matter",
  "Save note",
  "Upload document",
  "Invoice approval unavailable",
  "Statement sending unavailable"
] as const;

export function getDemoClientReviewRecord(slug: string): DemoClientReviewRecord | null {
  return demoClientReviewRecords.find((client) => client.slug === slug) ?? null;
}
