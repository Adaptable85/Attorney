import { adminSectionReviews } from "@/ui/admin/admin-section-review-data";
import { AdminSectionPage } from "@/ui/admin/admin-section-page";

export default async function AdminBillingPage() {
  return AdminSectionPage({ section: adminSectionReviews.billing });
}
