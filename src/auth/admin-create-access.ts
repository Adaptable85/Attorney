import type { AuthenticatedPrincipal } from "./auth-provider";
import { hasAdminShellAccess } from "./admin-access";
import { canCreateClientRecord } from "@/domain/clients";
import { canCreateMatterRecord } from "@/domain/matters";

export function canAccessClientMatterCreateForms(
  principal: AuthenticatedPrincipal | null
): principal is AuthenticatedPrincipal {
  if (!principal || !hasAdminShellAccess(principal)) {
    return false;
  }

  return (
    principal.roles.some(canCreateClientRecord) &&
    principal.roles.some(canCreateMatterRecord)
  );
}
