import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { loadStagingMatter } from "@/server/staging-matters";
import { MatterDetail } from "@/ui/admin/matter-detail";
import { getDemoMatterReviewRecord } from "@/ui/admin/matters-review-data";
import { StagingMatterDetail } from "@/ui/admin/staging-matter-detail";

export default async function AdminMatterDetailPage({
  params
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const { id } = await params;
  const liveMatter = await loadStagingMatter(id);
  const matter = getDemoMatterReviewRecord(id);

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        {liveMatter ? (
          <StagingMatterDetail matter={liveMatter} />
        ) : matter ? (
          <MatterDetail matter={matter} />
        ) : (
          <section className="read-detail" aria-label="Demo matter not found">
            <h1>Demo matter not found</h1>
            <p>This read-only preview only supports approved demo matter records.</p>
          </section>
        )}
      </main>
    </div>
  );
}
