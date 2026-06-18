import type { RoleKey } from "@/domain/roles";

const roleLabels: Record<RoleKey, string> = {
  OWNER_PRINCIPAL: "Owner / Principal",
  SUPPORT_ADMIN: "Support Admin",
  AGENT_SERVICE: "Agent Service",
  READ_ONLY_REVIEWER: "Read-Only Reviewer"
};

export function RoleBadge({ role }: Readonly<{ role: RoleKey }>) {
  return <span className="role-badge">{roleLabels[role]}</span>;
}
