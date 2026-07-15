import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { ClientDetailPreview } from "@/ui/admin/client-detail-preview";
import { getDemoClientReviewRecord } from "@/ui/admin/clients-review-data";
import { loadStagingClientFileDetail } from "@/server/staging-client-files";
import { LiveClientFileDetail } from "@/ui/admin/live-client-file-detail";
import { loadBillingItemTemplates } from "@/server/staging-billing-items";
import { loadClientDocuments } from "@/server/staging-documents";
import {
  evaluateStagingBillingItemsGate,
  evaluateStagingDocumentUploadGate,
  evaluateStagingMatterWritesGate
} from "@/config/staging-admin-live-gates";
import { loadStagingMatters } from "@/server/staging-matters";

export default async function AdminClientDetailPreviewPage({
  params,
  searchParams
}: Readonly<{
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    matterCreated?: string;
    matterError?: string;
    uploadError?: string;
    uploaded?: string;
  }>;
}>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const { slug } = await params;
  const query = await searchParams;
  const client = getDemoClientReviewRecord(slug);
  const liveClient = await loadStagingClientFileDetail(slug);
  const matters = liveClient ? await loadStagingMatters({ clientId: liveClient.id }) : [];
  const documents = liveClient ? await loadClientDocuments(liveClient.id) : [];
  const billingItems = await loadBillingItemTemplates({ activeOnly: true, limit: 8 });
  const matterWritesEnabled = evaluateStagingMatterWritesGate(access.principal).enabled;
  const documentUploadsEnabled = evaluateStagingDocumentUploadGate(access.principal).enabled;
  const billingItemsEnabled = evaluateStagingBillingItemsGate(access.principal).enabled;

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        {liveClient ? (
          <LiveClientFileDetail
            client={liveClient}
            matters={matters}
            documents={documents}
            billingItems={billingItems}
            matterWritesEnabled={matterWritesEnabled}
            documentUploadsEnabled={documentUploadsEnabled}
            billingItemsEnabled={billingItemsEnabled}
            uploaded={query?.uploaded === "1"}
            matterCreated={query?.matterCreated === "1"}
            matterError={query?.matterError}
            uploadError={query?.uploadError}
          />
        ) : client ? (
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
