import { requireAdminAccess } from "@/auth/admin-access";
import { canAccessClientMatterCreateForms } from "@/auth/admin-create-access";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { AdminNotAuthorized } from "@/ui/admin/admin-not-authorized";
import { MatterCreateForm } from "@/ui/admin/matter-create-form";

export default async function AdminMatterCreateFoundationPage() {
  const access = await requireAdminAccess();

  if (!access.allowed || !access.principal || !canAccessClientMatterCreateForms(access.principal)) {
    return <AdminNotAuthorized reason={access.reason === "allowed" ? "missing_admin_role" : access.reason} />;
  }

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        <MatterCreateForm />
      </main>
    </div>
  );
}
