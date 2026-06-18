import { AdminNotAuthorized } from "@/ui/admin/admin-not-authorized";

export default function AdminNotAuthorizedPage() {
  return <AdminNotAuthorized reason="missing_admin_role" />;
}
