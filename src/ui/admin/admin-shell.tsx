import type { AuthenticatedPrincipal } from "@/auth/auth-provider";

import { AdminHeader } from "./admin-header";
import type { AdminModule } from "./admin-modules";
import { AdminNav } from "./admin-nav";
import { ModuleCard } from "./module-card";
import { StatusCard } from "./status-card";

export function AdminShell({
  principal,
  modules
}: Readonly<{
  principal: AuthenticatedPrincipal;
  modules: readonly AdminModule[];
}>) {
  return (
    <div className="admin-shell">
      <AdminNav modules={modules} />
      <main className="admin-main">
        <AdminHeader principal={principal} />
        <div className="status-grid" aria-label="Admin shell status">
          <StatusCard title="Access Boundary">
            Local placeholder auth only. Production auth is not connected.
          </StatusCard>
          <StatusCard title="Data Boundary">
            No real client, matter, document or financial data is displayed.
          </StatusCard>
          <StatusCard title="Workflow Boundary">
            No approval, sending, publishing, upload or sync actions exist in this shell.
          </StatusCard>
        </div>
        <section className="module-grid" aria-label="Admin module placeholders">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </section>
      </main>
    </div>
  );
}
