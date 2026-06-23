import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import type { AuditEventWriter } from "@/audit/audit-service";
import type { RoleKey } from "@/domain/roles";
import { type ServiceResult, serviceFailure, serviceSuccess } from "./service-result";

export type ServiceActor = {
  userId: string;
  email: string;
  primaryRole: RoleKey;
  roles: readonly RoleKey[];
};

export type ServiceContext = {
  actor: ServiceActor;
  source: string;
  auditWriter: AuditEventWriter;
};

export function createServiceContext(
  principal: AuthenticatedPrincipal | null,
  options: Readonly<{
    auditWriter: AuditEventWriter;
    source: string;
  }>
): ServiceResult<ServiceContext> {
  if (!principal || principal.userId.trim() === "") {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "An authenticated service actor is required."
    });
  }

  const primaryRole = principal.roles[0];

  if (!primaryRole) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "A service actor role is required."
    });
  }

  return serviceSuccess({
    actor: {
      userId: principal.userId,
      email: principal.email,
      primaryRole,
      roles: principal.roles
    },
    source: options.source,
    auditWriter: options.auditWriter
  });
}
