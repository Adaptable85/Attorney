import { recordAuditEvent, type AuditEventInput } from "@/audit/audit-service";
import type { PermissionAction } from "@/domain/permissions";
import { canRolePerform } from "@/domain/permission-policy";
import {
  type ServiceResult,
  auditFailure,
  repositoryFailure,
  serviceFailure,
  serviceSuccess
} from "./service-result";
import type { ServiceContext } from "./service-context";

export type AuditedMutationConfig<T> = {
  context: ServiceContext;
  requiredPermission: PermissionAction;
  audit: Omit<AuditEventInput, "actorId"> | null;
  run(): Promise<T>;
};

export async function executeAuditedMutation<T>({
  context,
  requiredPermission,
  audit,
  run
}: AuditedMutationConfig<T>): Promise<ServiceResult<T>> {
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
    await recordAuditEvent(context.auditWriter, {
      ...audit,
      actorId: context.actor.userId,
      metadata: {
        ...audit.metadata,
        source: context.source,
        actorRole: context.actor.primaryRole
      }
    });
  } catch {
    return auditFailure();
  }

  try {
    return serviceSuccess(await run());
  } catch {
    return repositoryFailure();
  }
}
