import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { BillingDetailPreview } from "@/ui/admin/back-office-review";
import { getDemoBillingReviewRecord } from "@/ui/admin/back-office-review-data";

export default async function AdminBillingDetailPreviewPage({
  params
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const { slug } = await params;
  const record = getDemoBillingReviewRecord(slug);

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        {record ? (
          <BillingDetailPreview record={record} />
        ) : (
          <section className="read-detail" aria-label="Demo billing item not found">
            <h1>Demo billing item not found</h1>
            <p>This read-only preview only supports approved demo billing records.</p>
          </section>
        )}
      </main>
    </div>
  );
}
