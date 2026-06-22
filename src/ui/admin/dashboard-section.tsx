import type { AdminDashboardSection } from "@/domain/admin-dashboard";

import { ApprovalSummaryCard } from "./approval-summary-card";
import { MatterSummaryCard } from "./matter-summary-card";
import { RecentActivityList } from "./recent-activity-list";

export function DashboardSection({
  section
}: Readonly<{ section: AdminDashboardSection }>) {
  const isApprovalSection = section.id === "pending-approval-placeholders";
  const isActivitySection = section.id === "recent-audit-timeline";

  return (
    <section className="dashboard-section" aria-labelledby={`${section.id}-title`}>
      <div className="dashboard-section__header">
        <div>
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          <p>{section.description}</p>
        </div>
        <span>{section.demoLabel}</span>
      </div>
      {isApprovalSection ? (
        <ApprovalSummaryCard metrics={section.metrics} />
      ) : (
        <MatterSummaryCard metrics={section.metrics} />
      )}
      {isActivitySection ? (
        <RecentActivityList items={section.items} />
      ) : (
        <ul className="dashboard-items">
          {section.items.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <small>{item.meta}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
