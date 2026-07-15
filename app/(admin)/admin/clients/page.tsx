import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { ClientList } from "@/ui/admin/client-list";
import {
  getStagingClientFilePageState,
  loadStagingClientFileList
} from "@/server/staging-client-files";

export default async function AdminClientsPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<{
    q?: string;
    created?: string;
  }>;
}>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const params = await searchParams;
  const query = params?.q?.trim() ?? "";
  const pageState = getStagingClientFilePageState(access.principal);
  const { databaseAvailable, clients } = await loadStagingClientFileList({ query });

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        <ClientList
          clients={clients}
          query={query}
          writesEnabled={pageState.writesEnabled}
          databaseAvailable={pageState.databaseAvailable && databaseAvailable}
          created={params?.created === "1"}
        />
      </main>
    </div>
  );
}
