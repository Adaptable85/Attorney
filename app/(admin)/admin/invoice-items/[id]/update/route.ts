import { NextResponse } from "next/server";

import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  parseBillingItemTemplateFormData,
  saveBillingItemTemplate
} from "@/server/staging-billing-items";

function redirectToInvoiceItems(params: Record<string, string>): NextResponse {
  const query = new URLSearchParams(params);

  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/admin/invoice-items?${query.toString()}`
    }
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const access = await requireAdminRouteAccess();
  const { id } = await context.params;

  if (!access.allowed || !access.principal) {
    return redirectToInvoiceItems({
      error: "Admin sign-in is required before editing a staging billing item."
    });
  }

  if (!hasDatabaseUrl()) {
    return redirectToInvoiceItems({
      error: "DATABASE_URL is required before billing items can be saved."
    });
  }

  const result = await saveBillingItemTemplate({
    principal: access.principal,
    prisma: await getPrismaClient(),
    id,
    input: parseBillingItemTemplateFormData(await request.formData())
  });

  if (!result.ok) {
    return redirectToInvoiceItems({
      error: result.error.message
    });
  }

  return redirectToInvoiceItems({
    saved: "1"
  });
}
