import { requireAdminRouteAccess } from "@/auth/admin-route-access";

import { AdminAccessDenied } from "./admin-access-denied";
import { AdminHeader } from "./admin-header";
import { getVisibleAdminModules } from "./admin-modules";
import { AdminNav } from "./admin-nav";
import { AdminSectionReview } from "./admin-section-review";
import type { AdminSectionReviewModel } from "./admin-section-review";

export async function AdminSectionPage({
  section
}: Readonly<{ section: AdminSectionReviewModel }>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        <AdminSectionReview section={section} />
      </main>
    </div>
  );
}
