import { NextResponse } from "next/server";

import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  addStagingMatterTimelineNote,
  parseMatterTimelineFormData
} from "@/server/staging-matter-timeline";

function redirectToMatter(matterId: string, params: Record<string, string>): NextResponse {
  const query = new URLSearchParams(params);

  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/admin/matters/${encodeURIComponent(matterId)}?${query.toString()}#timeline`
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
      timelineError: "Admin sign-in is required before saving matter timeline notes."
    });
  }

  if (!hasDatabaseUrl()) {
    return redirectToMatter(id, {
      timelineError: "DATABASE_URL is required before matter timeline notes can be saved."
    });
  }

  const formData = await request.formData();
  const result = await addStagingMatterTimelineNote({
    principal: access.principal,
    prisma: await getPrismaClient(),
    input: {
      ...parseMatterTimelineFormData(formData),
      matterId: id
    }
  });

  if (!result.ok) {
    return redirectToMatter(id, {
      timelineError: result.error.message
    });
  }

  return redirectToMatter(id, {
    timelineAdded: "1"
  });
}
