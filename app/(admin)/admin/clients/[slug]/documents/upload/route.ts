import { NextResponse } from "next/server";

import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  parseDocumentUploadFormData,
  uploadStagingClientDocument
} from "@/server/staging-documents";

function redirectToClient(clientId: string, params: Record<string, string>): NextResponse {
  const query = new URLSearchParams(params);

  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/admin/clients/${encodeURIComponent(clientId)}?${query.toString()}#documents`
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
    return redirectToClient(slug, {
      uploadError: "Admin sign-in is required before uploading a staging document."
    });
  }

  if (!hasDatabaseUrl()) {
    return redirectToClient(slug, {
      uploadError: "DATABASE_URL is required before staging documents can be uploaded."
    });
  }

  const formData = await request.formData();
  const parsed = parseDocumentUploadFormData(formData);
  const result = await uploadStagingClientDocument({
    principal: access.principal,
    prisma: await getPrismaClient(),
    metadata: {
      ...parsed.metadata,
      clientId: slug
    },
    file: parsed.file
  });

  if (!result.ok) {
    return redirectToClient(slug, {
      uploadError: result.error.message
    });
  }

  return redirectToClient(slug, {
    uploaded: "1"
  });
}
