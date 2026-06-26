import type { AdminAccessDecision } from "@/auth/admin-access";

const reasonLabels: Record<AdminAccessDecision["reason"], string> = {
  allowed: "Access granted.",
  missing_user: "No authenticated local or production user is available.",
  password_access_disabled: "Staging password access is disabled.",
  password_access_unconfigured: "Staging password access is not configured.",
  password_required: "A staging admin password session is required.",
  agent_service_blocked: "Agent service users cannot access the normal admin shell.",
  missing_admin_role: "This user does not have an admin shell role."
};

export function AdminNotAuthorized({
  reason
}: Readonly<{ reason: AdminAccessDecision["reason"] }>) {
  return (
    <main className="not-authorized">
      <h1>Not authorized</h1>
      <p>{reasonLabels[reason]}</p>
    </main>
  );
}
