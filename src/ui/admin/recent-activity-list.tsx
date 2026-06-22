import type { AdminDashboardItem } from "@/domain/admin-dashboard";

export function RecentActivityList({
  items
}: Readonly<{ items: readonly AdminDashboardItem[] }>) {
  return (
    <ol className="dashboard-items dashboard-items--ordered">
      {items.map((item) => (
        <li key={item.title}>
          <strong>{item.title}</strong>
          <p>{item.description}</p>
          <small>{item.meta}</small>
        </li>
      ))}
    </ol>
  );
}
