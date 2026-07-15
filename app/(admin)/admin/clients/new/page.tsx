import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { ClientCreateForm } from "@/ui/admin/client-create-form";
import { getStagingClientFilePageState } from "@/server/staging-client-files";

export default async function AdminClientCreateFoundationPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<{
    error?: string;
  }>;
}>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const params = await searchParams;
  const pageState = getStagingClientFilePageState(access.principal);

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        <ClientCreateForm
          writesEnabled={pageState.writesEnabled}
          databaseAvailable={pageState.databaseAvailable}
          error={params?.error}
        />
      </main>
    </div>
  );
}
