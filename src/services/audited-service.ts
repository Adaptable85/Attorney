import { recordAuditEvent, type AuditEventInput } from "@/audit/audit-service";
import type { PermissionAction } from "@/domain/permissions";
import { canRolePerform } from "@/domain/permission-policy";
import {
  type ServiceResult,
  auditFailure,
  repositoryFailure,
  serviceFailure,
  serviceSuccess,
  transactionFailure
} from "./service-result";
import type { ServiceContext } from "./service-context";
import {
  immediateTransactionBoundary,
  type TransactionBoundary
} from "./transaction-boundary";
import type { AuditEventWriter } from "@/audit/audit-service";

class AuditedMutationAuditError extends Error {}
class AuditedMutationRepositoryError extends Error {}

export type AuditedMutationConfig<T, TScope = void> = {
  context: ServiceContext | null;
  requiredPermission: PermissionAction | null;
  audit: Omit<AuditEventInput, "actorId"> | null;
  transaction?: TransactionBoundary<TScope>;
  createAuditWriterForTransaction?(scope: TScope): AuditEventWriter;
  run(scope: TScope): Promise<T>;
};

export async function executeAuditedMutation<T, TScope = void>({
  context,
  requiredPermission,
  audit,
  transaction = immediateTransactionBoundary as TransactionBoundary<TScope>,
  createAuditWriterForTransaction,
  run
}: AuditedMutationConfig<T, TScope>): Promise<ServiceResult<T>> {
  if (!context || context.actor.userId.trim() === "") {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "An authenticated service actor is required."
    });
  }

  if (!requiredPermission) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "A permission decision is required for audited mutations."
    });
  }

  if (!canRolePerform(context.actor.primaryRole, requiredPermission)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "This user cannot perform the requested service action."
    });
  }

  if (!audit) {
    return auditFailure();
  }

  try {
    const data = await transaction.execute(async (scope) => {
      try {
        const auditWriter = createAuditWriterForTransaction?.(scope) ?? context.auditWriter;

        await recordAuditEvent(auditWriter, {
          ...audit,
          actorId: context.actor.userId,
          metadata: {
            ...audit.metadata,
            source: context.source,
            actorRole: context.actor.primaryRole
          }
        });
      } catch (error) {
        throw new AuditedMutationAuditError(
          error instanceof Error ? error.message : "Audit recording failed"
        );
      }

      try {
        return await run(scope);
      } catch (error) {
        throw new AuditedMutationRepositoryError(
          error instanceof Error ? error.message : "Repository mutation failed"
        );
      }
    });

    return serviceSuccess(data);
  } catch (error) {
    return classifyAuditedMutationFailure(error);
  }
}

export function classifyAuditedMutationFailure(error: unknown): ServiceResult<never> {
  if (error instanceof AuditedMutationAuditError) {
    return auditFailure();
  }

  if (error instanceof AuditedMutationRepositoryError) {
    return repositoryFailure();
  }

  return transactionFailure();
}
