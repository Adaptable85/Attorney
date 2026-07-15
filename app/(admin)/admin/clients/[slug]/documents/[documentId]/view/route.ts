import { createDocumentResponse } from "../../document-response";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string; documentId: string }> }
) {
  const params = await context.params;

  return createDocumentResponse({
    clientId: params.slug,
    documentId: params.documentId,
    action: "view"
  });
}
