import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { getStagingMatterPageState, loadStagingMatters } from "@/server/staging-matters";
import { StagingMatterList } from "@/ui/admin/staging-matter-list";

export default async function AdminMattersPage({
  searchParams
}: Readonly<{ searchParams?: Promise<{ q?: string }> }>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const params = await searchParams;
  const query = params?.q?.trim() ?? "";
  const matters = await loadStagingMatters({ query });
  const pageState = getStagingMatterPageState(access.principal);

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        <StagingMatterList
          matters={matters}
          query={query}
          databaseAvailable={pageState.databaseAvailable}
        />
      </main>
    </div>
  );
}
