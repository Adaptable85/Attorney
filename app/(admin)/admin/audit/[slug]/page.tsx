import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { AuditEventDetail } from "@/ui/admin/back-office-review";
import { getDemoAuditTimelineRecord } from "@/ui/admin/back-office-review-data";

export default async function AdminAuditEventDetailPage({
  params
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const { slug } = await params;
  const record = getDemoAuditTimelineRecord(slug);

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        {record ? (
          <AuditEventDetail record={record} />
        ) : (
          <section className="read-detail" aria-label="Demo audit event not found">
            <h1>Demo audit event not found</h1>
            <p>This read-only preview only supports approved demo audit records.</p>
          </section>
        )}
      </main>
    </div>
  );
}
