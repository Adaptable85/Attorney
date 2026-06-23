import type { AuthProvider, AuthenticatedPrincipal } from "./auth-provider";
import { requireAdminAccess, type AdminAccessDecision } from "./admin-access";

export type RequireAdminUserResult =
  | {
      ok: true;
      principal: AuthenticatedPrincipal;
    }
  | {
      ok: false;
      reason: Exclude<AdminAccessDecision["reason"], "allowed">;
    };

export async function requireAdminUser(provider?: AuthProvider): Promise<RequireAdminUserResult> {
  const decision = await requireAdminAccess(provider);

  if (!decision.allowed || !decision.principal) {
    return {
      ok: false,
      reason: decision.reason === "allowed" ? "missing_user" : decision.reason
    };
  }

  return {
    ok: true,
    principal: decision.principal
  };
}
