import type { AuthenticatedPrincipal, AuthProvider } from "./auth-provider";
import { getCurrentPrincipal } from "./current-user";
import type { RoleKey } from "@/domain/roles";

export type AdminAccessDecision = {
  allowed: boolean;
  reason:
    | "allowed"
    | "missing_user"
    | "password_access_disabled"
    | "password_access_unconfigured"
    | "password_required"
    | "agent_service_blocked"
    | "missing_admin_role";
  principal: AuthenticatedPrincipal | null;
};

const adminShellRoles: ReadonlySet<RoleKey> = new Set([
  "OWNER_PRINCIPAL",
  "SUPPORT_ADMIN",
  "READ_ONLY_REVIEWER"
]);

export function hasAdminShellAccess(principal: AuthenticatedPrincipal | null): boolean {
  if (!principal) {
    return false;
  }

  if (principal.roles.includes("AGENT_SERVICE")) {
    return false;
  }

  return principal.roles.some((role) => adminShellRoles.has(role));
}

export function evaluateAdminAccess(
  principal: AuthenticatedPrincipal | null
): AdminAccessDecision {
  if (!principal) {
    return {
      allowed: false,
      reason: "missing_user",
      principal
    };
  }

  if (principal.roles.includes("AGENT_SERVICE")) {
    return {
      allowed: false,
      reason: "agent_service_blocked",
      principal
    };
  }

  if (!principal.roles.some((role) => adminShellRoles.has(role))) {
    return {
      allowed: false,
      reason: "missing_admin_role",
      principal
    };
  }

  return {
    allowed: true,
    reason: "allowed",
    principal
  };
}

export async function requireAdminAccess(provider?: AuthProvider): Promise<AdminAccessDecision> {
  const principal = await getCurrentPrincipal(provider);

  return evaluateAdminAccess(principal);
}
