import type { AdminSectionReviewModel } from "./admin-section-review";

export const adminSectionReviews = {
  documents: {
    title: "Documents",
    eyebrow: "Private document structure",
    summary:
      "Review how future private document metadata, access labels and audit expectations will be presented. No file storage is connected.",
    reviewStatus: "Read-only placeholder",
    currentlyVisible: [
      {
        label: "Document scope",
        value: "Future matter-linked document metadata and review status labels."
      },
      {
        label: "Privacy posture",
        value: "Client documents must remain private by default."
      },
      {
        label: "Demo state",
        value: "No real files, file names, downloads or uploads are present."
      }
    ],
    intentionallyDisabled: [
      {
        label: "Uploads",
        value: "No upload control is available in this review phase."
      },
      {
        label: "Downloads",
        value: "No document download route is active."
      },
      {
        label: "Public storage",
        value: "Public client-document storage is not approved."
      }
    ],
    futureReviewQuestions: [
      "Which matter document categories should appear first?",
      "Which user roles may view document metadata?",
      "What audit details should be shown for document access?"
    ]
  },
  billing: {
    title: "Billing, Invoices and Statements",
    eyebrow: "Financial workflow structure",
    summary:
      "Review the future invoice and statement review shape. Official numbers, approvals, sending and external collection are not implemented.",
    reviewStatus: "Read-only placeholder",
    currentlyVisible: [
      {
        label: "Invoice posture",
        value: "Draft IDs only until owner/principal approval is implemented."
      },
      {
        label: "Statement posture",
        value: "Future client-facing statements require owner/principal approval before sending."
      },
      {
        label: "Accounting boundary",
        value: "Lexpro remains source of truth for trust, bookkeeping and reconciled records."
      }
    ],
    intentionallyDisabled: [
      {
        label: "Approvals",
        value: "No approve, assign-number or send action exists."
      },
      {
        label: "Corrections",
        value: "No correction or VAT override workflow is active."
      },
      {
        label: "External collection",
        value: "No external collection provider or online collection action is present."
      }
    ],
    futureReviewQuestions: [
      "Which invoice fields must Stephanie review before approval?",
      "Which statement summary fields matter most to clients?",
      "Where should Lexpro reconciliation status be visible later?"
    ]
  },
  lexpro: {
    title: "Lexpro Boundary",
    eyebrow: "Accounting source-of-truth review",
    summary:
      "Review the boundary between the Burgess platform and Lexpro. There is no import, sync or reconciliation job in this phase.",
    reviewStatus: "Read-only placeholder",
    currentlyVisible: [
      {
        label: "Source of truth",
        value: "Lexpro remains authoritative for legal accounting and reconciled records."
      },
      {
        label: "Burgess scope",
        value: "The platform is planned for invoices and client-facing statement PDFs only."
      },
      {
        label: "Demo state",
        value: "No Lexpro records or integration responses are displayed."
      }
    ],
    intentionallyDisabled: [
      {
        label: "Import",
        value: "No Lexpro import command or API route is active."
      },
      {
        label: "Sync",
        value: "No background sync, reconciliation or override is active."
      },
      {
        label: "Accounting edits",
        value: "No accounting data can be overwritten from this app."
      }
    ],
    futureReviewQuestions: [
      "Which Lexpro fields should be surfaced read-only later?",
      "What mismatch states need human review?",
      "Which correction records must be audit visible?"
    ]
  },
  audit: {
    title: "Audit Trail and Activity",
    eyebrow: "Sensitive action visibility",
    summary:
      "Review the planned audit trail shape. The current page contains no live event feed and no operational records.",
    reviewStatus: "Read-only placeholder",
    currentlyVisible: [
      {
        label: "Activity intent",
        value: "Future sensitive actions should show actor, role, action, timestamp and reason."
      },
      {
        label: "Read-only posture",
        value: "No audit record can be created, edited or deleted from this page."
      },
      {
        label: "Demo state",
        value: "No live audit data is displayed."
      }
    ],
    intentionallyDisabled: [
      {
        label: "Export",
        value: "No audit export action is available."
      },
      {
        label: "Manual entries",
        value: "No manual audit note form is active."
      },
      {
        label: "Deletion",
        value: "Protected record deletion is not available."
      }
    ],
    futureReviewQuestions: [
      "Which audit filters will be useful for owner review?",
      "Which actions must require a reason before submission?",
      "How much recent activity should be visible on the dashboard?"
    ]
  },
  access: {
    title: "Settings and Access Control",
    eyebrow: "Role and gate review",
    summary:
      "Review the visible role boundary and disabled release gates. Live Microsoft Entra auth, UI saves and production writes remain off.",
    reviewStatus: "Read-only placeholder",
    currentlyVisible: [
      {
        label: "Review role",
        value: "Password access grants a Read-Only Reviewer view for staging review."
      },
      {
        label: "Auth direction",
        value: "Microsoft Entra remains the accepted production identity direction."
      },
      {
        label: "Write gates",
        value: "Client/matter writes, UI saves and production writes remain blocked."
      }
    ],
    intentionallyDisabled: [
      {
        label: "Live login",
        value: "No live Microsoft redirect, token exchange or session wiring is enabled."
      },
      {
        label: "Role editing",
        value: "No user, role or permission editing form exists."
      },
      {
        label: "Production readiness",
        value: "Production auth readiness remains fail-closed."
      }
    ],
    futureReviewQuestions: [
      "Which Burgess users need owner, support or read-only access?",
      "Which sections should read-only reviewers see?",
      "Which write gates must be approved before any save action appears?"
    ]
  }
} satisfies Record<string, AdminSectionReviewModel>;
