import { requireAdminAccess } from "@/auth/admin-access";
import { AdminNotAuthorized } from "@/ui/admin/admin-not-authorized";
import { AdminShell } from "@/ui/admin/admin-shell";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";

export default async function AdminPage() {
  const access = await requireAdminAccess();

  if (!access.allowed || !access.principal) {
    return <AdminNotAuthorized reason={access.reason} />;
  }

  const modules = getVisibleAdminModules(access.principal);

  return <AdminShell principal={access.principal} modules={modules} />;
}
