import type { AdminDashboardMetric } from "@/domain/admin-dashboard";

export function MatterSummaryCard({
  metrics
}: Readonly<{ metrics: readonly AdminDashboardMetric[] }>) {
  return (
    <div className="dashboard-metrics" aria-label="Read-only placeholder summary">
      {metrics.map((metric) => (
        <article key={metric.label} className="dashboard-metric">
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <p>{metric.detail}</p>
        </article>
      ))}
    </div>
  );
}
