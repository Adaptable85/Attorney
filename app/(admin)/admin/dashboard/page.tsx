import { requireAdminAccess } from "@/auth/admin-access";
import { getAdminDashboardModel } from "@/domain/admin-dashboard";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { AdminNotAuthorized } from "@/ui/admin/admin-not-authorized";
import { DashboardOverview } from "@/ui/admin/dashboard-overview";

export default async function AdminDashboardPage() {
  const access = await requireAdminAccess();

  if (!access.allowed || !access.principal) {
    return <AdminNotAuthorized reason={access.reason} />;
  }

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        <DashboardOverview dashboard={getAdminDashboardModel(access.principal)} />
      </main>
    </div>
  );
}
