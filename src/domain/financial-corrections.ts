import { z } from "zod";

import { currencySchema, moneyCentsSchema } from "./money";
import { canCreateFinancialCorrections } from "./permission-policy";
import type { RoleKey } from "./roles";

export const financialCorrectionTypes = [
  "LINE_ITEM_CORRECTION",
  "INVOICE_CORRECTION",
  "STATEMENT_CORRECTION",
  "VAT_CORRECTION",
  "ADMIN_CORRECTION"
] as const;

export const financialCorrectionInputSchema = z.object({
  actorRole: z.enum(["OWNER_PRINCIPAL", "SUPPORT_ADMIN", "AGENT_SERVICE", "READ_ONLY_REVIEWER"]),
  actorId: z.string().trim().min(1),
  correctionType: z.enum(financialCorrectionTypes),
  targetRecordType: z.string().trim().min(1),
  targetRecordId: z.string().trim().min(1),
  reason: z.string().trim().min(1),
  amountDeltaCents: moneyCentsSchema.optional(),
  currency: currencySchema
});

export type FinancialCorrectionInput = z.input<typeof financialCorrectionInputSchema>;

export function createFinancialCorrectionPayload(input: FinancialCorrectionInput) {
  const parsed = financialCorrectionInputSchema.parse(input);

  if (!canCreateFinancialCorrections(parsed.actorRole as RoleKey)) {
    throw new Error("Only owner/principal may create final financial corrections");
  }

  return parsed;
}

