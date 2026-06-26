import { adminSectionReviews } from "@/ui/admin/admin-section-review-data";
import { AdminSectionPage } from "@/ui/admin/admin-section-page";

export default async function AdminAuditPage() {
  return AdminSectionPage({ section: adminSectionReviews.audit });
}
