import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminShell } from "@/ui/admin/admin-shell";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";

export default async function AdminPage() {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const modules = getVisibleAdminModules(access.principal);

  return <AdminShell principal={access.principal} modules={modules} />;
}
