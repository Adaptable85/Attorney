import { createMatterDocumentResponse } from "../../document-response";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string; documentId: string }> }
) {
  const params = await context.params;

  return createMatterDocumentResponse({
    matterId: params.id,
    documentId: params.documentId,
    action: "download"
  });
}
