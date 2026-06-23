import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import type { AuditEventInput } from "@/audit/audit-service";
import type { ClientMatterWriteGateDecision } from "@/config/release-gates";
import type { CreateClientInput } from "@/domain/clients";
import type { CreateMatterInput } from "@/domain/matters";
import type { PermissionAction } from "@/domain/permissions";
import { createClientRecord, type ClientSummary } from "@/services/clients-service";
import type { LocalDevClientMatterServiceComposition } from "@/services/local-dev-service-composition";
import { createMatterRecord, type MatterSummary } from "@/services/matters-service";
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

export type DevMutationEntrypointInput<TInput> = {
  principal: AuthenticatedPrincipal | null;
  releaseGate: ClientMatterWriteGateDecision;
  composition: LocalDevClientMatterServiceComposition | null;
  audit?: Omit<AuditEventInput, "actorId"> | null;
  input: TInput;
};

function disabledMutationResult(): ServiceResult<DisabledMutationEntrypointResult> {
  return serviceFailure({
    code: "SERVICE_CONTEXT_ERROR",
    message: "Live client/matter writes remain disabled until production auth and release approval are complete."
  });
}

function fakeDataFailure(): ServiceResult<never> {
  return serviceFailure({
    code: "VALIDATION_ERROR",
    message: "Dev-only client/matter mutations require fake DEMO-* account numbers."
  });
}

function defaultClientAudit(): Omit<AuditEventInput, "actorId"> {
  return {
    eventType: "client_created",
    targetType: "client",
    summary: "Dev-only client create mutation requested"
  };
}

function defaultMatterAudit(): Omit<AuditEventInput, "actorId"> {
  return {
    eventType: "matter_created",
    targetType: "matter",
    summary: "Dev-only matter create mutation requested"
  };
}

function requiresDemoAccountNumber(input: { accountNumber: string }): ServiceResult<true> {
  return input.accountNumber.trim().startsWith("DEMO-")
    ? { ok: true, data: true }
    : fakeDataFailure();
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

function createGateInput<TInput>(
  options: DevMutationEntrypointInput<TInput> & {
    permission: PermissionAction;
    audit: Omit<AuditEventInput, "actorId"> | null;
    transactionBoundary: TransactionBoundary<unknown> | null;
  }
) {
  const context = options.composition?.createServiceContext(options.principal) ?? null;

  return {
    context,
    gate: evaluateMutationGate({
      principal: options.principal,
      releaseGate: options.releaseGate,
      serviceContext: context?.ok ? context.data : null,
      permission: options.permission,
      audit: options.audit,
      transactionBoundary: options.transactionBoundary
    })
  };
}

export function createMatterAction(
  options: DisabledMutationEntrypointInput<CreateMatterInput>
): ServiceResult<DisabledMutationEntrypointResult> {
  return evaluateDisabledEntrypoint({
    ...options,
    permission: "create_matter"
  });
}

export async function createClientMutation(
  options: DevMutationEntrypointInput<CreateClientInput>
): Promise<ServiceResult<ClientSummary>> {
  const fakeCheck = requiresDemoAccountNumber(options.input);

  if (!fakeCheck.ok) {
    return fakeCheck;
  }

  const { context, gate } = createGateInput({
    ...options,
    permission: "create_client",
    audit: options.audit === undefined ? defaultClientAudit() : options.audit,
    transactionBoundary: options.composition?.clientDependencies.transactionBoundary ?? null
  });

  if (!gate.ok) {
    return gate;
  }

  if (!context?.ok || !options.composition) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Dev-only client mutation requires local/dev service composition."
    });
  }

  return createClientRecord(context.data, options.input, options.composition.clientDependencies);
}

export async function createMatterMutation(
  options: DevMutationEntrypointInput<CreateMatterInput>
): Promise<ServiceResult<MatterSummary>> {
  const fakeCheck = requiresDemoAccountNumber(options.input);

  if (!fakeCheck.ok) {
    return fakeCheck;
  }

  const { context, gate } = createGateInput({
    ...options,
    permission: "create_matter",
    audit: options.audit === undefined ? defaultMatterAudit() : options.audit,
    transactionBoundary: options.composition?.matterDependencies.transactionBoundary ?? null
  });

  if (!gate.ok) {
    return gate;
  }

  if (!context?.ok || !options.composition) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Dev-only matter mutation requires local/dev service composition."
    });
  }

  return createMatterRecord(context.data, options.input, options.composition.matterDependencies);
}
