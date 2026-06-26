import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { canAccessClientMatterCreateForms } from "@/auth/admin-create-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { AdminNotAuthorized } from "@/ui/admin/admin-not-authorized";
import { ClientCreateForm } from "@/ui/admin/client-create-form";

export default async function AdminClientCreateFoundationPage() {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  if (!canAccessClientMatterCreateForms(access.principal)) {
    return <AdminNotAuthorized reason="missing_admin_role" />;
  }

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        <ClientCreateForm />
      </main>
    </div>
  );
}
