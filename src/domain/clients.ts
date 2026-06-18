import { z } from "zod";

import { canCreateClients, canEditClients } from "./permission-policy";
import type { RoleKey } from "./roles";

export const clientStatuses = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const;

export const createClientInputSchema = z.object({
  accountNumber: z.string().trim().min(1, "Account number is required"),
  displayName: z.string().trim().min(1, "Display name is required"),
  status: z.enum(clientStatuses).default("ACTIVE")
});

export type CreateClientInput = z.input<typeof createClientInputSchema>;
export type ValidatedClientInput = z.output<typeof createClientInputSchema> & {
  normalizedSearch: string;
};

export function normalizeSearchField(...parts: Array<string | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .join(" ");
}

export function validateClientCreationInput(input: CreateClientInput): ValidatedClientInput {
  const parsed = createClientInputSchema.parse(input);

  return {
    ...parsed,
    normalizedSearch: normalizeSearchField(parsed.accountNumber, parsed.displayName)
  };
}

export function canCreateClientRecord(role: RoleKey): boolean {
  return canCreateClients(role);
}

export function canEditClientRecord(role: RoleKey): boolean {
  return canEditClients(role);
}

export function protectedClientRecordsAreSoftDeletedOnly(): true {
  return true;
}

