import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import {
  demoClientsRepository,
  demoMattersRepository
} from "@/services/demo-client-matter-data";
import { listClientSummaries } from "@/services/clients-service";
import { listMatterSummaries } from "@/services/matters-service";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { createClientListItems } from "@/ui/admin/client-matter-read-model";
import { ClientList } from "@/ui/admin/client-list";

export default async function AdminClientsPage() {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const [clientsResult, mattersResult] = await Promise.all([
    listClientSummaries(access.principal, { clientsRepository: demoClientsRepository }),
    listMatterSummaries(access.principal, { mattersRepository: demoMattersRepository })
  ]);

  const clients = clientsResult.ok ? clientsResult.data : [];
  const matters = mattersResult.ok ? mattersResult.data : [];

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        <ClientList clients={createClientListItems(clients, matters)} />
      </main>
    </div>
  );
}
