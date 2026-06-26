import { isAdminPasswordAccessReason } from "@/auth/admin-route-access";
import type { AdminAccessDecision } from "@/auth/admin-access";

import { AdminNotAuthorized } from "./admin-not-authorized";
import { AdminPasswordSignIn } from "./admin-password-sign-in";

export function AdminAccessDenied({
  reason
}: Readonly<{ reason: AdminAccessDecision["reason"] }>) {
  if (isAdminPasswordAccessReason(reason)) {
    return <AdminPasswordSignIn reason={reason} />;
  }

  return <AdminNotAuthorized reason={reason} />;
}
