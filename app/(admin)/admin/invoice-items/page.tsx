import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { AdminAccessDenied } from "@/ui/admin/admin-access-denied";
import { AdminHeader } from "@/ui/admin/admin-header";
import { getVisibleAdminModules } from "@/ui/admin/admin-modules";
import { AdminNav } from "@/ui/admin/admin-nav";
import { InvoiceItemsReview } from "@/ui/admin/invoice-items-review";
import {
  getStagingBillingItemsPageState,
  loadBillingItemTemplates
} from "@/server/staging-billing-items";

export default async function AdminInvoiceItemsPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
}>) {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return <AdminAccessDenied reason={access.reason} />;
  }

  const params = await searchParams;
  const pageState = getStagingBillingItemsPageState(access.principal);
  const billingItems = await loadBillingItemTemplates();

  return (
    <div className="admin-shell">
      <AdminNav modules={getVisibleAdminModules(access.principal)} />
      <main className="admin-main">
        <AdminHeader principal={access.principal} />
        <InvoiceItemsReview
          billingItems={billingItems}
          writesEnabled={pageState.writesEnabled}
          databaseAvailable={pageState.databaseAvailable}
          saved={params?.saved === "1"}
          error={params?.error}
        />
      </main>
    </div>
  );
}
