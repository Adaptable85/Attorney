import { buildDisabledEntraCallbackResponse } from "@/auth/entra/entra-route-handlers";

export function GET(request: Request) {
  return buildDisabledEntraCallbackResponse(request.url);
}

