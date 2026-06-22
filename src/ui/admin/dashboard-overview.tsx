import type { AdminDashboardModel } from "@/domain/admin-dashboard";

import { DashboardSection } from "./dashboard-section";

export function DashboardOverview({
  dashboard
}: Readonly<{ dashboard: AdminDashboardModel }>) {
  return (
    <section className="dashboard-overview" aria-labelledby="dashboard-title">
      <div className="dashboard-overview__header">
        <div>
          <h1 id="dashboard-title">{dashboard.title}</h1>
          <p>{dashboard.boundaryLabel}</p>
        </div>
        <span className="dashboard-overview__tag">Read-only</span>
      </div>
      <div className="dashboard-grid">
        {dashboard.sections.map((section) => (
          <DashboardSection key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}
