export type DemoBillingReviewRecord = {
  slug: string;
  title: string;
  linkedClient: string;
  linkedClientSlug: string;
  linkedMatter: string;
  linkedMatterSlug: string;
  recordType:
    | "Draft invoice"
    | "Draft statement"
    | "Fee note"
    | "Disbursement review"
    | "Write-off review"
    | "Client balance review";
  status:
    | "Draft only"
    | "Awaiting principal review"
    | "Needs Lexpro check"
    | "Client query"
    | "Ready for future approval design"
    | "Archived candidate";
  amountPlaceholder: string;
  datePlaceholder: string;
  approvalStatePlaceholder: string;
  lexproBoundaryNote: string;
  reviewNote: string;
  lineItemSummary: readonly string[];
  auditNote: string;
};

export type DemoLexproBoundaryItem = {
  slug: string;
  boundaryArea: string;
  currentSystemOfRecord: string;
  burgessFutureRole: string;
  riskLevel: "Medium" | "High" | "Critical";
  requiredApproval: string;
  reviewNote: string;
  allowedDisplayLater: readonly string[];
  notAllowedWithoutApproval: readonly string[];
  auditConsiderations: string;
};

export type DemoAuditTimelineRecord = {
  slug: string;
  timestampPlaceholder: string;
  actorPlaceholder: string;
  role: string;
  actionType:
    | "Viewed client"
    | "Prepared draft matter note"
    | "Linked document"
    | "Reviewed billing draft"
    | "Requested approval"
    | "Access role changed"
    | "Export requested"
    | "Login/session event";
  section: string;
  linkedRecord: string;
  result: string;
  sensitivity: string;
  reviewNote: string;
  beforeAfterPlaceholder: string;
  retentionNote: string;
};

export type DemoAccessRole = {
  role: string;
  summary: string;
  permissions: Record<AccessPermissionKey, string>;
};

export type AccessPermissionKey =
  | "viewClients"
  | "viewMatters"
  | "viewDocuments"
  | "viewBillingSummaries"
  | "prepareDraftRecords"
  | "approveRecords"
  | "manageAccess"
  | "viewAuditTrail"
  | "configureIntegrations";

export const accessPermissionLabels: Record<AccessPermissionKey, string> = {
  viewClients: "View clients",
  viewMatters: "View matters",
  viewDocuments: "View documents",
  viewBillingSummaries: "View billing summaries",
  prepareDraftRecords: "Prepare draft records",
  approveRecords: "Approve records",
  manageAccess: "Manage access",
  viewAuditTrail: "View audit trail",
  configureIntegrations: "Configure integrations"
};

export const demoBillingReviewRecords: readonly DemoBillingReviewRecord[] = [
  {
    slug: "demo-statement-review",
    title: "Demo family trust statement review",
    linkedClient: "Demo Family Trust",
    linkedClientSlug: "demo-family-trust",
    linkedMatter: "Demo Property Transfer",
    linkedMatterSlug: "demo-property-transfer",
    recordType: "Draft statement",
    status: "Awaiting principal review",
    amountPlaceholder: "R 12,450.00 placeholder",
    datePlaceholder: "2026-06-18 placeholder",
    approvalStatePlaceholder: "Not approved; principal review required",
    lexproBoundaryNote: "Lexpro remains source of truth for reconciled accounting balances.",
    reviewNote: "Review whether statement previews should group client and matter history.",
    lineItemSummary: [
      "Professional fee summary placeholder",
      "Disbursement summary placeholder",
      "Prior balance context placeholder"
    ],
    auditNote: "Future generation and send events must require principal approval and audit metadata."
  },
  {
    slug: "demo-property-transfer-fee-note",
    title: "Demo property transfer fee note",
    linkedClient: "Demo Family Trust",
    linkedClientSlug: "demo-family-trust",
    linkedMatter: "Demo Property Transfer",
    linkedMatterSlug: "demo-property-transfer",
    recordType: "Fee note",
    status: "Draft only",
    amountPlaceholder: "R 8,900.00 placeholder",
    datePlaceholder: "2026-06-20 placeholder",
    approvalStatePlaceholder: "Draft-only review label",
    lexproBoundaryNote: "No official invoice number exists before approval.",
    reviewNote: "Confirm which fee note fields are useful before any invoice workflow exists.",
    lineItemSummary: [
      "Consultation and preparation placeholder",
      "Property correspondence placeholder"
    ],
    auditNote: "Future draft edits should record actor, reason and timestamp."
  },
  {
    slug: "demo-commercial-disbursement-review",
    title: "Demo commercial disbursement review",
    linkedClient: "Demo Kuils River Trading Pty Ltd",
    linkedClientSlug: "demo-kuils-river-company",
    linkedMatter: "Demo Supply Agreement Review",
    linkedMatterSlug: "demo-supply-agreement-review",
    recordType: "Disbursement review",
    status: "Needs Lexpro check",
    amountPlaceholder: "R 1,275.00 placeholder",
    datePlaceholder: "2026-06-21 placeholder",
    approvalStatePlaceholder: "Needs accounting-source check",
    lexproBoundaryNote: "Disbursement accuracy must be confirmed against Lexpro before display.",
    reviewNote: "Review how disbursement notes should be separated from professional fees.",
    lineItemSummary: [
      "Courier/copying placeholder",
      "External service placeholder"
    ],
    auditNote: "Future disbursement corrections require a reason and audit record."
  },
  {
    slug: "demo-client-query-balance",
    title: "Demo client query balance review",
    linkedClient: "Demo Repeat Commercial Client",
    linkedClientSlug: "demo-repeat-commercial-client",
    linkedMatter: "Demo General Advice Matter",
    linkedMatterSlug: "demo-general-advice",
    recordType: "Client balance review",
    status: "Client query",
    amountPlaceholder: "R 3,300.00 placeholder",
    datePlaceholder: "2026-06-22 placeholder",
    approvalStatePlaceholder: "Query review only",
    lexproBoundaryNote: "Client-facing balance context cannot override Lexpro records.",
    reviewNote: "Decide whether client queries should appear on billing or matter records.",
    lineItemSummary: [
      "Historic balance placeholder",
      "Query response status placeholder"
    ],
    auditNote: "Future query resolution should preserve the original question and response."
  },
  {
    slug: "demo-write-off-review",
    title: "Demo write-off review candidate",
    linkedClient: "Demo Archived Candidate",
    linkedClientSlug: "demo-archived-candidate",
    linkedMatter: "Demo Closed Family Matter",
    linkedMatterSlug: "demo-closed-family-matter",
    recordType: "Write-off review",
    status: "Archived candidate",
    amountPlaceholder: "R 950.00 placeholder",
    datePlaceholder: "Historic placeholder",
    approvalStatePlaceholder: "No write-off action available",
    lexproBoundaryNote: "Write-off decisions must stay under accounting and principal approval.",
    reviewNote: "Confirm whether archived candidates should be visible in review filters.",
    lineItemSummary: [
      "Historic draft balance placeholder",
      "Archive review note placeholder"
    ],
    auditNote: "Future write-off approval must require explicit principal authority."
  },
  {
    slug: "demo-future-invoice-design",
    title: "Demo future invoice design review",
    linkedClient: "Demo Individual Client",
    linkedClientSlug: "demo-individual-client",
    linkedMatter: "Demo Family Consultation",
    linkedMatterSlug: "demo-family-consultation",
    recordType: "Draft invoice",
    status: "Ready for future approval design",
    amountPlaceholder: "R 2,100.00 placeholder",
    datePlaceholder: "2026-06-23 placeholder",
    approvalStatePlaceholder: "Approval design not active",
    lexproBoundaryNote: "Official numbering must wait until an accepted approval process exists.",
    reviewNote: "Use this example to review draft invoice fields before any write path.",
    lineItemSummary: [
      "Consultation placeholder",
      "Admin preparation placeholder"
    ],
    auditNote: "Future invoice number assignment must be audit logged."
  }
];

export const billingReviewPrompts = [
  "Should Burgess review draft invoices inside this platform?",
  "Should statements appear per client, per matter, or both?",
  "Who may prepare draft billing records?",
  "Who must approve an invoice or statement before it is sent?",
  "Which billing statuses match the real office process?",
  "What information must remain only in Lexpro?",
  "Should invoice numbers only be created after approval?",
  "Should the platform ever show payment status, or should Lexpro remain the only source of truth?",
  "What should happen when a client queries a statement?"
] as const;

export const disabledBillingFutureActions = [
  "Create invoice",
  "Edit invoice",
  "Generate statement",
  "Send to client",
  "Request approval",
  "Post to Lexpro",
  "Mark paid",
  "Download PDF",
  "View audit history"
] as const;

export const demoLexproBoundaryItems: readonly DemoLexproBoundaryItem[] = [
  {
    slug: "demo-client-master-data-boundary",
    boundaryArea: "Client master data",
    currentSystemOfRecord: "Burgess platform for future operational client profile; Lexpro for accounting-linked client records.",
    burgessFutureRole: "Display approved client context and route updates through reviewed workflows.",
    riskLevel: "Medium",
    requiredApproval: "Principal attorney and implementation review before any two-way mapping.",
    reviewNote: "Confirm which client identifiers may appear in both systems.",
    allowedDisplayLater: ["Client display name", "Matter reference context", "Operational status labels"],
    notAllowedWithoutApproval: ["Accounting identifiers", "Bulk imports", "Automated overwrites"],
    auditConsiderations: "Future changes must record actor, source system and reason."
  },
  {
    slug: "demo-matter-references-boundary",
    boundaryArea: "Matter references",
    currentSystemOfRecord: "Burgess platform for operational matter workflow; Lexpro where accounting references apply.",
    burgessFutureRole: "Show matter context and reconcile labels without changing Lexpro.",
    riskLevel: "Medium",
    requiredApproval: "Data mapping approval before reference matching is automated.",
    reviewNote: "Review whether matter codes should be manually confirmed first.",
    allowedDisplayLater: ["Matter title", "Matter type", "Reference placeholder"],
    notAllowedWithoutApproval: ["Automated reference creation", "Bulk sync", "Accounting status edits"],
    auditConsiderations: "Reference changes need before/after values."
  },
  {
    slug: "demo-invoice-statement-drafts-boundary",
    boundaryArea: "Invoice and statement drafts",
    currentSystemOfRecord: "Burgess platform for future client-facing drafts; Lexpro for official accounting records where applicable.",
    burgessFutureRole: "Prepare draft review summaries before principal approval.",
    riskLevel: "High",
    requiredApproval: "Principal attorney approval plus financial workflow review.",
    reviewNote: "Invoice numbers must not be assigned before approval.",
    allowedDisplayLater: ["Draft summary", "Approval state", "Client-facing statement preview labels"],
    notAllowedWithoutApproval: ["Official numbering", "Client send action", "Accounting post-back"],
    auditConsiderations: "Draft creation, approval and send events must be separately logged."
  },
  {
    slug: "demo-trust-accounting-boundary",
    boundaryArea: "Trust and accounting records",
    currentSystemOfRecord: "Lexpro",
    burgessFutureRole: "Display only explicitly approved high-level review indicators, if approved later.",
    riskLevel: "Critical",
    requiredApproval: "Principal attorney, accounting/compliance review and rollback plan.",
    reviewNote: "Trust accounting must not be edited or replicated from this platform.",
    allowedDisplayLater: ["Approved high-level status label", "Manual review flag"],
    notAllowedWithoutApproval: ["Trust balances", "Ledger detail", "Reconciliation operations", "Write-back"],
    auditConsiderations: "Any display approval must be traceable and time-bound."
  },
  {
    slug: "demo-payment-reconciliation-boundary",
    boundaryArea: "Payment and reconciliation status",
    currentSystemOfRecord: "Lexpro",
    burgessFutureRole: "Potentially display reviewed status labels only after approval.",
    riskLevel: "High",
    requiredApproval: "Accounting process owner and principal attorney sign-off.",
    reviewNote: "Payment status must not become an operational trigger without accounting review.",
    allowedDisplayLater: ["Reviewed status label", "Last checked placeholder"],
    notAllowedWithoutApproval: ["Mark paid action", "Reconciliation job", "Accounting correction"],
    auditConsiderations: "Future status checks must record source and timestamp."
  },
  {
    slug: "demo-compliance-audit-boundary",
    boundaryArea: "Compliance and audit records",
    currentSystemOfRecord: "Lexpro and approved audit records",
    burgessFutureRole: "Surface operational audit context without replacing compliance records.",
    riskLevel: "High",
    requiredApproval: "Compliance review before any import/export or report mapping.",
    reviewNote: "Compliance evidence must remain controlled and reviewable.",
    allowedDisplayLater: ["Audit summary", "Review status", "Required follow-up label"],
    notAllowedWithoutApproval: ["Compliance export", "Evidence deletion", "Automated filing"],
    auditConsiderations: "Future compliance views must record viewer and purpose."
  }
];

export const lexproReviewPrompts = [
  "Which data must remain only in Lexpro?",
  "Which data may the Burgess platform display later?",
  "Should the platform ever update Lexpro, or only read/display?",
  "Who can approve any future Lexpro integration?",
  "What accounting/trust boundaries must never be crossed?",
  "What reports are needed outside Lexpro?",
  "What should the audit trail record if future sync is approved?"
] as const;

export const disabledLexproFutureActions = [
  "Connect Lexpro",
  "Import data",
  "Export data",
  "Sync records",
  "Push updates",
  "Configure credentials",
  "Run reconciliation"
] as const;

export const demoAuditTimelineRecords: readonly DemoAuditTimelineRecord[] = [
  {
    slug: "demo-client-viewed",
    timestampPlaceholder: "2026-06-24 09:10 placeholder",
    actorPlaceholder: "Demo Read-Only Reviewer",
    role: "Read-Only Reviewer",
    actionType: "Viewed client",
    section: "Clients",
    linkedRecord: "Demo Family Trust",
    result: "Allowed read-only view",
    sensitivity: "Client profile visibility",
    reviewNote: "Review whether client views should always be logged.",
    beforeAfterPlaceholder: "No data changed; view event only.",
    retentionNote: "Future retention period requires policy approval."
  },
  {
    slug: "demo-matter-note-prepared",
    timestampPlaceholder: "2026-06-24 10:35 placeholder",
    actorPlaceholder: "Demo Draft Assistant",
    role: "Draft-only Assistant / Service User",
    actionType: "Prepared draft matter note",
    section: "Matters",
    linkedRecord: "Demo Property Transfer",
    result: "Draft prepared; no client communication sent",
    sensitivity: "Matter workflow note",
    reviewNote: "Assistant activity should remain draft-only and reviewable.",
    beforeAfterPlaceholder: "Draft note placeholder created; no matter record write is active now.",
    retentionNote: "Draft activity retention must be approved before live use."
  },
  {
    slug: "demo-document-linked",
    timestampPlaceholder: "2026-06-24 11:20 placeholder",
    actorPlaceholder: "Demo Admin Reviewer",
    role: "Admin / Reception",
    actionType: "Linked document",
    section: "Documents",
    linkedRecord: "Demo Signed Mandate",
    result: "Future link event example only",
    sensitivity: "Private document metadata",
    reviewNote: "Document link changes should capture source and reason.",
    beforeAfterPlaceholder: "Before: unlinked placeholder; after: matter-linked placeholder.",
    retentionNote: "Document access logs should be retained for legal file history."
  },
  {
    slug: "demo-billing-draft-reviewed",
    timestampPlaceholder: "2026-06-24 12:00 placeholder",
    actorPlaceholder: "Demo Finance Reviewer",
    role: "Finance / Billing Reviewer",
    actionType: "Reviewed billing draft",
    section: "Billing",
    linkedRecord: "Demo family trust statement review",
    result: "Review recorded as placeholder only",
    sensitivity: "Financial draft visibility",
    reviewNote: "Billing reviews should not create official invoices automatically.",
    beforeAfterPlaceholder: "Approval state unchanged; no write path is enabled.",
    retentionNote: "Billing audit retention must support future correction records."
  },
  {
    slug: "demo-approval-requested",
    timestampPlaceholder: "2026-06-24 13:15 placeholder",
    actorPlaceholder: "Demo Attorney",
    role: "Attorney / Professional Staff",
    actionType: "Requested approval",
    section: "Billing",
    linkedRecord: "Demo future invoice design review",
    result: "Future approval request example only",
    sensitivity: "Principal approval boundary",
    reviewNote: "Approval requests should be visible before any send action.",
    beforeAfterPlaceholder: "Before: draft only; after: awaiting approval placeholder.",
    retentionNote: "Approval request evidence should be retained with invoice history."
  },
  {
    slug: "demo-access-role-changed",
    timestampPlaceholder: "2026-06-24 14:40 placeholder",
    actorPlaceholder: "Demo Principal Attorney",
    role: "Principal Attorney / Owner",
    actionType: "Access role changed",
    section: "Access",
    linkedRecord: "Demo Build Support access",
    result: "Future time-limited access example only",
    sensitivity: "Access control",
    reviewNote: "Role changes must require owner authority and clear reason.",
    beforeAfterPlaceholder: "Before: no support access; after: time-limited support placeholder.",
    retentionNote: "Access changes should be retained permanently or by approved policy."
  },
  {
    slug: "demo-export-requested",
    timestampPlaceholder: "2026-06-24 15:25 placeholder",
    actorPlaceholder: "Demo Professional Staff",
    role: "Attorney / Professional Staff",
    actionType: "Export requested",
    section: "Documents",
    linkedRecord: "Demo FICA Identity Pack",
    result: "Denied until export policy exists",
    sensitivity: "Private document export",
    reviewNote: "Exports may need approval, reason capture and evidence retention.",
    beforeAfterPlaceholder: "No export generated.",
    retentionNote: "Denied export requests should remain visible for review."
  },
  {
    slug: "demo-login-session-event",
    timestampPlaceholder: "2026-06-24 16:05 placeholder",
    actorPlaceholder: "Demo Read-Only Reviewer",
    role: "Read-Only Reviewer",
    actionType: "Login/session event",
    section: "Access",
    linkedRecord: "Staging password session",
    result: "Read-only review session granted",
    sensitivity: "Authentication boundary",
    reviewNote: "Failed and successful login attempts should be reviewed for visibility.",
    beforeAfterPlaceholder: "No production Entra session created.",
    retentionNote: "Session audit retention requires production auth policy."
  }
];

export const auditReviewPrompts = [
  "What actions must always be audited?",
  "How long should audit logs be retained?",
  "Who may view audit logs?",
  "Should failed login attempts be visible?",
  "Should client/matter/document views be audited?",
  "Should exported records require approval?",
  "What actions should trigger alerts?",
  "Should audit records ever be deleted?"
] as const;

export const disabledAuditFutureActions = [
  "Export audit log",
  "Download evidence",
  "Resolve event",
  "Add comment",
  "Escalate",
  "Delete event"
] as const;

const allowed = "Allowed";
const limited = "Limited";
const proposalOnly = "Proposal only";
const notProposed = "Not proposed";

export const demoAccessRoles: readonly DemoAccessRole[] = [
  {
    role: "Principal Attorney / Owner",
    summary: "Future production owner with final approval authority.",
    permissions: {
      viewClients: allowed,
      viewMatters: allowed,
      viewDocuments: allowed,
      viewBillingSummaries: allowed,
      prepareDraftRecords: allowed,
      approveRecords: allowed,
      manageAccess: allowed,
      viewAuditTrail: allowed,
      configureIntegrations: allowed
    }
  },
  {
    role: "Attorney / Professional Staff",
    summary: "Professional staff role for legal work under owner boundaries.",
    permissions: {
      viewClients: allowed,
      viewMatters: allowed,
      viewDocuments: allowed,
      viewBillingSummaries: limited,
      prepareDraftRecords: allowed,
      approveRecords: notProposed,
      manageAccess: notProposed,
      viewAuditTrail: limited,
      configureIntegrations: notProposed
    }
  },
  {
    role: "Admin / Reception",
    summary: "Office support role for intake and document-follow-up review.",
    permissions: {
      viewClients: allowed,
      viewMatters: limited,
      viewDocuments: limited,
      viewBillingSummaries: notProposed,
      prepareDraftRecords: proposalOnly,
      approveRecords: notProposed,
      manageAccess: notProposed,
      viewAuditTrail: notProposed,
      configureIntegrations: notProposed
    }
  },
  {
    role: "Finance / Billing Reviewer",
    summary: "Future draft billing reviewer without final approval power.",
    permissions: {
      viewClients: limited,
      viewMatters: limited,
      viewDocuments: notProposed,
      viewBillingSummaries: allowed,
      prepareDraftRecords: allowed,
      approveRecords: notProposed,
      manageAccess: notProposed,
      viewAuditTrail: limited,
      configureIntegrations: notProposed
    }
  },
  {
    role: "Build Support",
    summary: "Time-limited technical support without owner approval powers.",
    permissions: {
      viewClients: limited,
      viewMatters: limited,
      viewDocuments: notProposed,
      viewBillingSummaries: notProposed,
      prepareDraftRecords: notProposed,
      approveRecords: notProposed,
      manageAccess: notProposed,
      viewAuditTrail: limited,
      configureIntegrations: notProposed
    }
  },
  {
    role: "Draft-only Assistant / Service User",
    summary: "Automation/service role that may prepare drafts but cannot approve, send or mutate protected records directly.",
    permissions: {
      viewClients: limited,
      viewMatters: limited,
      viewDocuments: limited,
      viewBillingSummaries: notProposed,
      prepareDraftRecords: proposalOnly,
      approveRecords: notProposed,
      manageAccess: notProposed,
      viewAuditTrail: notProposed,
      configureIntegrations: notProposed
    }
  },
  {
    role: "Read-Only Reviewer",
    summary: "Current staging review role for Wesley and Stephanie review access.",
    permissions: {
      viewClients: allowed,
      viewMatters: allowed,
      viewDocuments: allowed,
      viewBillingSummaries: allowed,
      prepareDraftRecords: notProposed,
      approveRecords: notProposed,
      manageAccess: notProposed,
      viewAuditTrail: allowed,
      configureIntegrations: notProposed
    }
  }
];

export const accessReviewPrompts = [
  "Who should be the production owner?",
  "Which staff roles are needed first?",
  "Who may view all clients and matters?",
  "Who may view billing summaries?",
  "Who may approve invoices/statements later?",
  "Who may manage users?",
  "Should build support have time-limited access?",
  "Should assistant/service users be draft-only?",
  "What should happen when a staff member leaves?"
] as const;

export const disabledAccessFutureActions = [
  "Invite user",
  "Change role",
  "Remove user",
  "Enable Microsoft login",
  "Reset access",
  "Configure SSO",
  "View secrets"
] as const;

export function getDemoBillingReviewRecord(slug: string): DemoBillingReviewRecord | null {
  return demoBillingReviewRecords.find((record) => record.slug === slug) ?? null;
}

export function getDemoLexproBoundaryItem(slug: string): DemoLexproBoundaryItem | null {
  return demoLexproBoundaryItems.find((item) => item.slug === slug) ?? null;
}

export function getDemoAuditTimelineRecord(slug: string): DemoAuditTimelineRecord | null {
  return demoAuditTimelineRecords.find((record) => record.slug === slug) ?? null;
}
