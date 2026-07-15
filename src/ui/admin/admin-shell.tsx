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
            <p className="review-hero__eyebrow">Client-file first review</p>
            <h2 id="review-workspace-title">Admin client file workspace</h2>
            <p>
              Use this private workspace to review the simpler Burgess workflow:
              open a client file, then review matters, documents, notes, billing
              drafts, statements and audit history from that file.
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
            No save, create, approval, sending, upload, LLM call, sync or external collection actions exist.
          </StatusCard>
        </div>
        <section className="review-checklist" aria-labelledby="review-checklist-title">
          <h2 id="review-checklist-title">Review checklist</h2>
          <ul>
            <li>Start from Client Files and confirm that everything important sits inside the client record.</li>
            <li>Review matters, documents, voice/text notes, billing drafts, invoices and statements as structure only.</li>
            <li>Check that Invoice Items are reusable building blocks, not official invoices.</li>
            <li>Note missing labels or workflow steps before any write capability, upload or AI action is approved.</li>
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
