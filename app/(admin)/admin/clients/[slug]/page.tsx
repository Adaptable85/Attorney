import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { ClientDetailPreview } from "@/ui/admin/client-detail-preview";
import { getDemoClientReviewRecord } from "@/ui/admin/clients-review-data";

export default async function AdminClientDetailPreviewPage({
  params
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const { slug } = await params;
  const client = getDemoClientReviewRecord(slug);

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        {client ? (
          <ClientDetailPreview client={client} />
        ) : (
          <section className="read-detail" aria-label="Demo client not found">
            <h1>Demo client not found</h1>
            <p>This read-only preview only supports approved demo client records.</p>
          </section>
        )}
      </main>
    </div>
  );
}
