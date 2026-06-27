import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { DocumentDetailPreview } from "@/ui/admin/document-detail-preview";
import { getDemoDocumentReviewRecord } from "@/ui/admin/documents-review-data";

export default async function AdminDocumentDetailPreviewPage({
  params
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const { slug } = await params;
  const document = getDemoDocumentReviewRecord(slug);

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        {document ? (
          <DocumentDetailPreview document={document} />
        ) : (
          <section className="read-detail" aria-label="Demo document not found">
            <h1>Demo document not found</h1>
            <p>This read-only preview only supports approved demo document records.</p>
          </section>
        )}
      </main>
    </div>
  );
}
