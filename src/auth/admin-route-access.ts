import { cookies } from "next/headers";

import {
  adminPasswordSessionCookieName,
  getAdminPasswordAccessConfig,
  verifyAdminPasswordSessionCookieValue
} from "./admin-password-access";
import { evaluateAdminAccess, type AdminAccessDecision } from "./admin-access";

export function isAdminPasswordAccessReason(
  reason: AdminAccessDecision["reason"]
): boolean {
  return reason === "password_access_disabled" ||
    reason === "password_access_unconfigured" ||
    reason === "password_required";
}

export async function requireAdminRouteAccess(): Promise<AdminAccessDecision> {
  const config = getAdminPasswordAccessConfig();

  if (!config.enabled || !config.configured) {
    return {
      allowed: false,
      reason: config.reason,
      principal: null
    };
  }

  const cookieStore = await cookies();
  const principal = verifyAdminPasswordSessionCookieValue(
    cookieStore.get(adminPasswordSessionCookieName)?.value,
    config
  );

  if (!principal) {
    return {
      allowed: false,
      reason: "password_required",
      principal: null
    };
  }

  return evaluateAdminAccess(principal);
}
