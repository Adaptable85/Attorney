import type { RoleKey } from "./roles";
import { canAssignInvoiceNumbers } from "./permission-policy";

export function canAssignOfficialInvoiceNumber(role: RoleKey): boolean {
  return canAssignInvoiceNumbers(role);
}

export function buildOfficialInvoiceNumber(prefix: string, nextNumber: number): string {
  if (!Number.isInteger(nextNumber) || nextNumber <= 0) {
    throw new Error("Invoice number sequence value must be a positive integer");
  }

  return `${prefix}${String(nextNumber).padStart(5, "0")}`;
}

