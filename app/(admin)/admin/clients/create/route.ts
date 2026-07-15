import { NextResponse } from "next/server";

import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  createStagingClientFile,
  parseClientFileFormData
} from "@/server/staging-client-files";

function redirectToNew(error: string): NextResponse {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/admin/clients/new?error=${encodeURIComponent(error)}`
    }
  });
}

function redirectToClientList(): NextResponse {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: "/admin/clients?created=1"
    }
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return redirectToNew("Admin sign-in is required before creating a staging client file.");
  }

  const formData = await request.formData();

  if (!hasDatabaseUrl()) {
    return redirectToNew("DATABASE_URL is required before staging client files can be saved.");
  }

  const result = await createStagingClientFile({
    principal: access.principal,
    prisma: await getPrismaClient(),
    input: parseClientFileFormData(formData)
  });

  if (!result.ok) {
    return redirectToNew(result.error.message);
  }

  return redirectToClientList();
}
