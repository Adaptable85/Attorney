import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import {
  demoClientsRepository,
  demoMattersRepository
} from "@/services/demo-client-matter-data";
import { listClientSummaries } from "@/services/clients-service";
import { getMatterSummary } from "@/services/matters-service";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { createMatterDetailItem } from "@/ui/admin/client-matter-read-model";
import { MatterDetail } from "@/ui/admin/matter-detail";

export default async function AdminMatterDetailPage({
  params
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const { id } = await params;
  const [clientsResult, matterResult] = await Promise.all([
    listClientSummaries(access.principal, { clientsRepository: demoClientsRepository }),
    getMatterSummary(access.principal, id, { mattersRepository: demoMattersRepository })
  ]);

  const clients = clientsResult.ok ? clientsResult.data : [];

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        {matterResult.ok ? (
          <MatterDetail matter={createMatterDetailItem(matterResult.data, clients)} />
        ) : (
          <section className="read-detail" aria-label="Matter not found">
            <h1>Matter not found</h1>
            <p>{matterResult.error.message}</p>
          </section>
        )}
      </main>
    </div>
  );
}
