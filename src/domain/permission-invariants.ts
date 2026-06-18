import { canRolePerform } from "./permission-policy";
import type { PermissionAction } from "./permissions";
import type { RoleKey } from "./roles";

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

const legacyRoleMap = {
  owner_principal: "OWNER_PRINCIPAL",
  build_support: "SUPPORT_ADMIN",
  openclaw_agent: "AGENT_SERVICE"
} as const satisfies Record<ActorRole, RoleKey>;

const legacyActionMap = {
  approve_invoice: "approve_invoice",
  send_invoice: "send_client_communication",
  approve_statement: "approve_statement",
  send_statement: "send_statement",
  publish_marketing: "publish_marketing",
  send_outreach: "send_outreach",
  delete_protected_record: "delete_protected_record",
  override_accounting_data: "override_accounting_data",
  provide_final_legal_advice: "send_client_communication"
} as const satisfies Record<SensitiveAction, PermissionAction>;

export function canPerformSensitiveAction(role: ActorRole, action: SensitiveAction): boolean {
  if (!(action in legacyActionMap)) {
    return false;
  }

  return canRolePerform(legacyRoleMap[role], legacyActionMap[action]);
}

export function invoiceNumberRequiresApproval(): true {
  return true;
}
