export type ActorRole = "owner_principal" | "build_support" | "openclaw_agent";

export type SensitiveAction =
  | "approve_invoice"
  | "send_invoice"
  | "approve_statement"
  | "send_statement"
  | "publish_marketing"
  | "send_outreach"
  | "delete_protected_record"
  | "override_accounting_data"
  | "provide_final_legal_advice";

const ownerOnlyActions: ReadonlySet<SensitiveAction> = new Set([
  "approve_invoice",
  "send_invoice",
  "approve_statement",
  "send_statement",
  "publish_marketing",
  "send_outreach",
  "delete_protected_record",
  "override_accounting_data",
  "provide_final_legal_advice"
]);

export function canPerformSensitiveAction(role: ActorRole, action: SensitiveAction): boolean {
  if (!ownerOnlyActions.has(action)) {
    return false;
  }

  return role === "owner_principal";
}

export function invoiceNumberRequiresApproval(): true {
  return true;
}

