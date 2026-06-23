import { buildDisabledEntraAuthResponse } from "@/auth/entra/entra-route-handlers";

export function POST() {
  return buildDisabledEntraAuthResponse("logout");
}

