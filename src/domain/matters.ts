import { z } from "zod";

import { normalizeSearchField } from "./clients";
import { canCreateMatters, canEditMatters } from "./permission-policy";
import type { RoleKey } from "./roles";

export const matterTypes = [
  "FAMILY_LAW",
  "MAINTENANCE",
  "DIVORCE",
  "CARE_AND_CUSTODY",
  "COMMERCIAL_LAW",
  "FINANCIAL_DISTRESS",
  "CONTRACTS",
  "BUSINESS_RESCUE",
  "CIVIL_LITIGATION",
  "OTHER"
] as const;

export const matterStatuses = [
  "OPEN",
  "PENDING",
  "WAITING_ON_CLIENT",
  "WAITING_ON_COURT",
  "WAITING_ON_PAYMENT",
  "CLOSED",
  "ARCHIVED"
] as const;

export const createMatterInputSchema = z.object({
  clientId: z.string().trim().min(1, "Client id is required"),
  accountNumber: z.string().trim().min(1, "Account number is required"),
  name: z.string().trim().min(1, "Matter name is required"),
  description: z.string().trim().min(1, "Matter description is required"),
  type: z.enum(matterTypes),
  status: z.enum(matterStatuses).default("OPEN"),
  responsibleAttorneyId: z.string().trim().min(1).optional(),
  supportUserId: z.string().trim().min(1).optional(),
  nextStepDueDate: z.date().optional()
});

export type CreateMatterInput = z.input<typeof createMatterInputSchema>;
export type ValidatedMatterInput = z.output<typeof createMatterInputSchema> & {
  normalizedSearch: string;
};

export function validateMatterCreationInput(input: CreateMatterInput): ValidatedMatterInput {
  const parsed = createMatterInputSchema.parse(input);

  return {
    ...parsed,
    normalizedSearch: normalizeSearchField(
      parsed.accountNumber,
      parsed.name,
      parsed.description,
      parsed.type,
      parsed.status
    )
  };
}

export function canCreateMatterRecord(role: RoleKey): boolean {
  return canCreateMatters(role);
}

export function canEditMatterRecord(role: RoleKey): boolean {
  return canEditMatters(role);
}

export function protectedMatterRecordsAreSoftDeletedOnly(): true {
  return true;
}

