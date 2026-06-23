import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import type { AuditEventInput } from "@/audit/audit-service";
import type { ClientMatterWriteGateDecision } from "@/config/release-gates";
import { canRolePerform } from "@/domain/permission-policy";
import type { PermissionAction } from "@/domain/permissions";
import type { ServiceContext } from "./service-context";
import { type ServiceResult, serviceFailure, serviceSuccess } from "./service-result";
import type { TransactionBoundary } from "./transaction-boundary";

export type MutationGateInput = {
  principal: AuthenticatedPrincipal | null;
  releaseGate: ClientMatterWriteGateDecision;
  serviceContext: ServiceContext | null;
  permission: PermissionAction | null;
  audit: Omit<AuditEventInput, "actorId"> | null;
  transactionBoundary: TransactionBoundary<unknown> | null;
};

export type MutationGateDecision = {
  principal: AuthenticatedPrincipal;
  serviceContext: ServiceContext;
  permission: PermissionAction;
  audit: Omit<AuditEventInput, "actorId">;
  transactionBoundary: TransactionBoundary<unknown>;
};

export function evaluateMutationGate(input: MutationGateInput): ServiceResult<MutationGateDecision> {
  if (!input.releaseGate.enabled) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "The requested mutation is disabled by release gate."
    });
  }

  if (!input.principal || input.principal.userId.trim() === "") {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "An authenticated production-compatible principal is required."
    });
  }

  if (!input.serviceContext) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Mutation entrypoints require a service context."
    });
  }

  const primaryRole = input.principal.roles[0];

  if (!primaryRole || !input.permission) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "A permission decision is required for mutation entrypoints."
    });
  }

  if (!canRolePerform(primaryRole, input.permission)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "This user cannot perform the requested mutation."
    });
  }

  if (!input.audit) {
    return serviceFailure({
      code: "AUDIT_ERROR",
      message: "Mutation entrypoints require audit metadata."
    });
  }

  if (!input.transactionBoundary) {
    return serviceFailure({
      code: "TRANSACTION_ERROR",
      message: "Mutation entrypoints require an audited transaction boundary."
    });
  }

  return serviceSuccess({
    principal: input.principal,
    serviceContext: input.serviceContext,
    permission: input.permission,
    audit: input.audit,
    transactionBoundary: input.transactionBoundary
  });
}
