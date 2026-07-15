import { NextResponse } from "next/server";

import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  parseMatterDocumentUploadFormData,
  uploadStagingMatterDocument
} from "@/server/staging-documents";
import { loadStagingMatter } from "@/server/staging-matters";

function redirectToMatter(matterId: string, params: Record<string, string>): NextResponse {
  const query = new URLSearchParams(params);

  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/admin/matters/${encodeURIComponent(matterId)}?${query.toString()}#documents`
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
      documentError: "Admin sign-in is required before uploading a staging matter document."
    });
  }

  if (!hasDatabaseUrl()) {
    return redirectToMatter(id, {
      documentError: "DATABASE_URL is required before staging matter documents can be uploaded."
    });
  }

  const matter = await loadStagingMatter(id);

  if (!matter) {
    return redirectToMatter(id, {
      documentError: "Matter was not found."
    });
  }

  const formData = await request.formData();
  const parsed = parseMatterDocumentUploadFormData(formData);
  const result = await uploadStagingMatterDocument({
    principal: access.principal,
    prisma: await getPrismaClient(),
    metadata: {
      ...parsed.metadata,
      clientId: matter.clientId,
      matterId: id,
      matterReference: parsed.metadata.matterReference || matter.accountNumber
    },
    file: parsed.file
  });

  if (!result.ok) {
    return redirectToMatter(id, {
      documentError: result.error.message
    });
  }

  return redirectToMatter(id, {
    documentUploaded: "1"
  });
}
