import { NextResponse } from "next/server";

import { requireAdminRouteAccess } from "@/auth/admin-route-access";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import { getStagingMatterDocumentContent } from "@/server/staging-documents";

function safeHeaderFilename(filename: string): string {
  return filename.replace(/["\r\n]/g, "_");
}

export async function createMatterDocumentResponse(options: {
  matterId: string;
  documentId: string;
  action: "view" | "download";
}): Promise<NextResponse> {
  const access = await requireAdminRouteAccess();

  if (!access.allowed || !access.principal) {
    return new NextResponse("Admin sign-in is required before opening staging matter documents.", {
      status: 401
    });
  }

  if (!hasDatabaseUrl()) {
    return new NextResponse("DATABASE_URL is required before opening staging matter documents.", {
      status: 503
    });
  }

  const result = await getStagingMatterDocumentContent({
    principal: access.principal,
    prisma: await getPrismaClient(),
    matterId: options.matterId,
    documentId: options.documentId,
    action: options.action
  });

  if (!result.ok) {
    return new NextResponse(result.error.message, {
      status: result.error.code === "NOT_FOUND" ? 404 : 403
    });
  }

  const disposition = options.action === "download" ? "attachment" : "inline";
  const filename = safeHeaderFilename(result.data.filename);
  const body = new ArrayBuffer(result.data.bytes.byteLength);
  new Uint8Array(body).set(result.data.bytes);

  return new NextResponse(new Blob([body], { type: result.data.contentType }), {
    status: 200,
    headers: {
      "Content-Type": result.data.contentType,
      "Content-Length": String(result.data.sizeBytes),
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      "Cache-Control": "private, no-store"
    }
  });
}
