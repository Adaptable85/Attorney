import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import {
  evaluateStagingDocumentUploadGate,
  evaluateStagingMatterInvoicesGate,
  evaluateStagingMatterWritesGate
} from "@/config/staging-admin-live-gates";
import { loadMatterDocuments } from "@/server/staging-documents";
import { loadBillingItemTemplates } from "@/server/staging-billing-items";
import {
  loadMatterBillingLines,
  loadMatterDraftInvoices
} from "@/server/staging-matter-invoices";
import { loadMatterTimeline } from "@/server/staging-matter-timeline";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { loadStagingMatter } from "@/server/staging-matters";
import { MatterDetail } from "@/ui/admin/matter-detail";
import { getDemoMatterReviewRecord } from "@/ui/admin/matters-review-data";
import { StagingMatterDetail } from "@/ui/admin/staging-matter-detail";

export default async function AdminMatterDetailPage({
  params,
  searchParams
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    documentUploaded?: string;
    documentError?: string;
    timelineAdded?: string;
    timelineError?: string;
    billingLineAdded?: string;
    billingError?: string;
    invoiceCreated?: string;
    invoiceError?: string;
  }>;
}>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const { id } = await params;
  const query = await searchParams;
  const liveMatter = await loadStagingMatter(id);
  const documents = liveMatter ? await loadMatterDocuments(liveMatter.id) : [];
  const timeline = liveMatter ? await loadMatterTimeline(liveMatter.id) : [];
  const billingLines = liveMatter ? await loadMatterBillingLines(liveMatter.id) : [];
  const draftInvoices = liveMatter ? await loadMatterDraftInvoices(liveMatter.id) : [];
  const billingItems = liveMatter ? await loadBillingItemTemplates({ activeOnly: true }) : [];
  const documentUploadsEnabled = evaluateStagingDocumentUploadGate(access.principal).enabled;
  const matterWritesEnabled = evaluateStagingMatterWritesGate(access.principal).enabled;
  const matterInvoicesEnabled = evaluateStagingMatterInvoicesGate(access.principal).enabled;
  const matter = getDemoMatterReviewRecord(id);

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        {liveMatter ? (
          <StagingMatterDetail
            matter={liveMatter}
            documents={documents}
            timeline={timeline}
            billingLines={billingLines}
            draftInvoices={draftInvoices}
            billingItems={billingItems}
            documentUploadsEnabled={documentUploadsEnabled}
            matterWritesEnabled={matterWritesEnabled}
            matterInvoicesEnabled={matterInvoicesEnabled}
            documentUploaded={query?.documentUploaded === "1"}
            documentError={query?.documentError}
            timelineAdded={query?.timelineAdded === "1"}
            timelineError={query?.timelineError}
            billingLineAdded={query?.billingLineAdded === "1"}
            billingError={query?.billingError}
            invoiceCreated={query?.invoiceCreated === "1"}
            invoiceError={query?.invoiceError}
          />
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
