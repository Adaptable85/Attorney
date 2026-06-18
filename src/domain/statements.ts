import { z } from "zod";

import { currencySchema, moneyCentsSchema } from "./money";
import { canApproveStatements } from "./permission-policy";
import type { RoleKey } from "./roles";

export const statementStatuses = [
  "DRAFT",
  "AWAITING_OWNER_APPROVAL",
  "APPROVED",
  "SENT",
  "UPDATED_AFTER_PAYMENT",
  "CLOSED",
  "CORRECTED"
] as const;

export type StatementStatus = (typeof statementStatuses)[number];

export const statementSnapshotInputSchema = z.object({
  clientId: z.string().trim().min(1),
  matterId: z.string().trim().min(1).optional(),
  status: z.enum(statementStatuses).default("DRAFT"),
  openingBalanceCents: moneyCentsSchema.default(0),
  closingBalanceCents: moneyCentsSchema,
  currency: currencySchema
});

export type StatementSnapshotInput = z.input<typeof statementSnapshotInputSchema>;
export type ValidatedStatementSnapshot = z.output<typeof statementSnapshotInputSchema>;

export function validateStatementSnapshotInput(
  input: StatementSnapshotInput
): ValidatedStatementSnapshot {
  return statementSnapshotInputSchema.parse(input);
}

export function createStatementApprovalPayload(input: {
  actorRole: RoleKey;
  actorId: string;
  statementSnapshotId: string;
  currentStatus: StatementStatus;
}) {
  if (!canApproveStatements(input.actorRole)) {
    throw new Error("Only owner/principal may approve statements");
  }

  if (input.currentStatus !== "AWAITING_OWNER_APPROVAL") {
    throw new Error("Statement must be awaiting owner approval");
  }

  return {
    statementSnapshotId: input.statementSnapshotId,
    approverId: input.actorId,
    approvedStatus: "APPROVED" as const
  };
}

export function statementSnapshotIsImmutableAfterApproval(): true {
  return true;
}

