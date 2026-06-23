import { buildDisabledEntraAuthResponse } from "@/auth/entra/entra-route-handlers";

export function GET() {
  return buildDisabledEntraAuthResponse("login");
}

