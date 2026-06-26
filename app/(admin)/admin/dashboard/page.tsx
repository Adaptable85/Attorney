import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getAdminDashboardModel } from "@/domain/admin-dashboard";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { DashboardOverview } from "@/ui/admin/dashboard-overview";

export default async function AdminDashboardPage() {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
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
