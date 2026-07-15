import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { loadStagingClientFileDetail } from "@/server/staging-client-files";
import { getStagingMatterPageState } from "@/server/staging-matters";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { StagingMatterCreateForm } from "@/ui/admin/staging-matter-create-form";

export default async function AdminClientMatterCreatePage({
  params,
  searchParams
}: Readonly<{
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ error?: string }>;
}>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const { slug } = await params;
  const query = await searchParams;
  const client = await loadStagingClientFileDetail(slug);
  const pageState = getStagingMatterPageState(access.principal);

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        {client ? (
          <StagingMatterCreateForm
            client={client}
            writesEnabled={pageState.writesEnabled}
            databaseAvailable={pageState.databaseAvailable}
            error={query?.error}
          />
        ) : (
          <section className="read-detail" aria-label="Client file not found">
            <h1>Client file not found</h1>
            <p>Open matters from a saved staging client file only.</p>
          </section>
        )}
      </main>
    </div>
  );
}
