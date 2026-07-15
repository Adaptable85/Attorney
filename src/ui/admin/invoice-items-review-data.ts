export type DemoInvoiceItemTemplate = {
  slug: string;
  label: string;
  category: "Fee" | "Disbursement" | "Admin" | "Adjustment";
  description: string;
  amountCentsPlaceholder: number;
  vatTreatment: "VAT configurable" | "No VAT proposed" | "Requires review";
  typicalSource: string;
};

export const demoInvoiceItemTemplates: readonly DemoInvoiceItemTemplate[] = [
  {
    slug: "consultation",
    label: "Consultation",
    category: "Fee",
    description: "Reusable consultation line for client or matter notes.",
    amountCentsPlaceholder: 85000,
    vatTreatment: "VAT configurable",
    typicalSource: "Text note or voice note"
  },
  {
    slug: "drafting",
    label: "Drafting",
    category: "Fee",
    description: "Drafting of agreements, letters or legal documents.",
    amountCentsPlaceholder: 150000,
    vatTreatment: "VAT configurable",
    typicalSource: "Matter work note"
  },
  {
    slug: "correspondence",
    label: "Correspondence",
    category: "Fee",
    description: "Email, letter or telephone correspondence captured as draft billing.",
    amountCentsPlaceholder: 65000,
    vatTreatment: "VAT configurable",
    typicalSource: "Voice note or activity note"
  },
  {
    slug: "perusal",
    label: "Perusal",
    category: "Fee",
    description: "Review of documents supplied by a client, counterparty or institution.",
    amountCentsPlaceholder: 120000,
    vatTreatment: "VAT configurable",
    typicalSource: "Document review note"
  },
  {
    slug: "filing-disbursement",
    label: "Filing disbursement",
    category: "Disbursement",
    description: "Placeholder for recoverable filing or third-party charge review.",
    amountCentsPlaceholder: 35000,
    vatTreatment: "Requires review",
    typicalSource: "Receipt or disbursement note"
  },
  {
    slug: "admin-fee",
    label: "Admin fee",
    category: "Admin",
    description: "Administrative preparation placeholder for later approval design.",
    amountCentsPlaceholder: 45000,
    vatTreatment: "VAT configurable",
    typicalSource: "Internal admin note"
  }
];

export const disabledInvoiceItemActions = [
  "Create invoice item",
  "Edit invoice item",
  "Apply item to invoice",
  "Approve invoice",
  "Assign invoice number",
  "Send statement"
] as const;

export function formatPlaceholderRand(amountCents: number): string {
  return `R ${(amountCents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} placeholder`;
}
