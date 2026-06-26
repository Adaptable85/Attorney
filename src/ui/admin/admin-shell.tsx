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
        <section className="review-hero" aria-labelledby="review-workspace-title">
          <div>
            <p className="review-hero__eyebrow">Section-by-section review</p>
            <h2 id="review-workspace-title">Admin review workspace</h2>
            <p>
              Use this private workspace to review the planned Burgess admin sections
              without creating records, changing data or enabling live workflows.
            </p>
          </div>
          <span className="review-hero__badge">Read-only Reviewer mode</span>
        </section>
        <div className="status-grid" aria-label="Admin shell status">
          <StatusCard title="Access Boundary">
            Password-protected staging review only. Live Microsoft Entra auth is not enabled.
          </StatusCard>
          <StatusCard title="Data Boundary">
            Demo placeholder data only. No real client, matter, document or financial data is displayed.
          </StatusCard>
          <StatusCard title="Workflow Boundary">
            No save, create, approval, sending, upload, sync or external collection actions exist.
          </StatusCard>
        </div>
        <section className="review-checklist" aria-labelledby="review-checklist-title">
          <h2 id="review-checklist-title">Review checklist</h2>
          <ul>
            <li>Confirm whether the dashboard sections match Burgess Attorneys&apos; workflow.</li>
            <li>Review the client and matter fields as structure only; no data is live.</li>
            <li>Check that document, billing, Lexpro, audit and access boundaries are clear.</li>
            <li>Note missing labels or workflow steps before any write capability is approved.</li>
          </ul>
        </section>
        <section className="module-grid" aria-label="Admin section review map">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </section>
      </main>
    </div>
  );
}
