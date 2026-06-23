import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import type { AuditEventInput } from "@/audit/audit-service";
import type { ClientMatterWriteGateDecision } from "@/config/release-gates";
import type { CreateClientInput } from "@/domain/clients";
import type { CreateMatterInput } from "@/domain/matters";
import type { PermissionAction } from "@/domain/permissions";
import { evaluateMutationGate } from "@/services/mutation-gate";
import type { ServiceContext } from "@/services/service-context";
import { type ServiceResult, serviceFailure } from "@/services/service-result";
import type { TransactionBoundary } from "@/services/transaction-boundary";

export type DisabledMutationEntrypointInput<TInput> = {
  principal: AuthenticatedPrincipal | null;
  releaseGate: ClientMatterWriteGateDecision;
  serviceContext: ServiceContext | null;
  audit: Omit<AuditEventInput, "actorId"> | null;
  transactionBoundary: TransactionBoundary<unknown> | null;
  input: TInput;
};

export type DisabledMutationEntrypointResult = {
  status: "disabled";
};

function disabledMutationResult(): ServiceResult<DisabledMutationEntrypointResult> {
  return serviceFailure({
    code: "SERVICE_CONTEXT_ERROR",
    message: "Live client/matter writes remain disabled until production auth and release approval are complete."
  });
}

function evaluateDisabledEntrypoint<TInput>(
  options: DisabledMutationEntrypointInput<TInput> & {
    permission: PermissionAction;
  }
): ServiceResult<DisabledMutationEntrypointResult> {
  const gate = evaluateMutationGate({
    principal: options.principal,
    releaseGate: options.releaseGate,
    serviceContext: options.serviceContext,
    permission: options.permission,
    audit: options.audit,
    transactionBoundary: options.transactionBoundary
  });

  if (!gate.ok) {
    return gate;
  }

  void options.input;

  return disabledMutationResult();
}

export function createClientAction(
  options: DisabledMutationEntrypointInput<CreateClientInput>
): ServiceResult<DisabledMutationEntrypointResult> {
  return evaluateDisabledEntrypoint({
    ...options,
    permission: "create_client"
  });
}

export function createMatterAction(
  options: DisabledMutationEntrypointInput<CreateMatterInput>
): ServiceResult<DisabledMutationEntrypointResult> {
  return evaluateDisabledEntrypoint({
    ...options,
    permission: "create_matter"
  });
}
