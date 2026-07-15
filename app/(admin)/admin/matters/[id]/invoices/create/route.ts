import { NextResponse } from "next/server";

import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import { createMatterDraftInvoice } from "@/server/staging-matter-invoices";

function redirectToMatter(matterId: string, params: Record<string, string>): NextResponse {
  const query = new URLSearchParams(params);

  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/admin/matters/${encodeURIComponent(matterId)}?${query.toString()}#draft-invoices`
    }
  });
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const access = await requireAdminRouteAccess();
  const { id } = await context.params;

  if (!access.allowed || !access.principal) {
    return redirectToMatter(id, {
      invoiceError: "Admin sign-in is required before creating a matter draft invoice."
    });
  }

  if (!hasDatabaseUrl()) {
    return redirectToMatter(id, {
      invoiceError: "DATABASE_URL is required before matter draft invoices can be saved."
    });
  }

  const result = await createMatterDraftInvoice({
    principal: access.principal,
    prisma: await getPrismaClient(),
    matterId: id
  });

  if (!result.ok) {
    return redirectToMatter(id, {
      invoiceError: result.error.message
    });
  }

  return redirectToMatter(id, {
    invoiceCreated: "1"
  });
}
