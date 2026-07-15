import { NextResponse } from "next/server";

import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  addMatterDraftBillingLine,
  parseMatterBillingLineFormData
} from "@/server/staging-matter-invoices";

function redirectToMatter(matterId: string, params: Record<string, string>): NextResponse {
  const query = new URLSearchParams(params);

  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/admin/matters/${encodeURIComponent(matterId)}?${query.toString()}#billing-items`
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
    return redirectToMatter(id, {
      billingError: "Admin sign-in is required before adding matter billing lines."
    });
  }

  if (!hasDatabaseUrl()) {
    return redirectToMatter(id, {
      billingError: "DATABASE_URL is required before matter billing lines can be saved."
    });
  }

  const result = await addMatterDraftBillingLine({
    principal: access.principal,
    prisma: await getPrismaClient(),
    input: {
      ...parseMatterBillingLineFormData(await request.formData()),
      matterId: id
    }
  });

  if (!result.ok) {
    return redirectToMatter(id, {
      billingError: result.error.message
    });
  }

  return redirectToMatter(id, {
    billingLineAdded: "1"
  });
}
