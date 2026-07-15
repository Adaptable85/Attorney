import { NextResponse } from "next/server";

import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import { createStagingMatter, parseMatterCreateFormData } from "@/server/staging-matters";

function redirectToNew(clientId: string, error: string): NextResponse {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/admin/clients/${encodeURIComponent(clientId)}/matters/new?error=${encodeURIComponent(error)}`
    }
  });
}

function redirectToClient(clientId: string, params: Record<string, string>): NextResponse {
  const query = new URLSearchParams(params);

  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/admin/clients/${encodeURIComponent(clientId)}?${query.toString()}#matters`
    }
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const access = await requireAdminRouteAccess();
  const { slug } = await context.params;

  if (!access.allowed || !access.principal) {
    return redirectToNew(slug, "Admin sign-in is required before opening a staging matter.");
  }

  if (!hasDatabaseUrl()) {
    return redirectToNew(slug, "DATABASE_URL is required before staging matters can be saved.");
  }

  const formData = await request.formData();
  const result = await createStagingMatter({
    principal: access.principal,
    prisma: await getPrismaClient(),
    input: {
      ...parseMatterCreateFormData(formData),
      clientId: slug
    }
  });

  if (!result.ok) {
    return redirectToNew(slug, result.error.message);
  }

  return redirectToClient(slug, {
    matterCreated: "1"
  });
}
