export type EntraRouteName = "login" | "callback" | "logout";

export type EntraDisabledPayload = {
  ok: false;
  code: "entra_auth_not_enabled";
  route: EntraRouteName;
  message: string;
};

const disabledStatus = 503;

function disabledMessage(route: EntraRouteName): string {
  return `Microsoft Entra ${route} is not configured or enabled yet.`;
}

export function buildDisabledEntraAuthPayload(route: EntraRouteName): EntraDisabledPayload {
  return {
    ok: false,
    code: "entra_auth_not_enabled",
    route,
    message: disabledMessage(route)
  };
}

export function buildDisabledEntraAuthResponse(route: EntraRouteName): Response {
  return Response.json(buildDisabledEntraAuthPayload(route), {
    status: disabledStatus,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export function validateDisabledCallbackInput(url: URL): EntraDisabledPayload {
  const route = "callback";

  if (!url.searchParams.get("code") || !url.searchParams.get("state")) {
    return {
      ...buildDisabledEntraAuthPayload(route),
      message: "Microsoft Entra callback is disabled and requires reviewed code/state handling before use."
    };
  }

  return buildDisabledEntraAuthPayload(route);
}

export function buildDisabledEntraCallbackResponse(requestUrl: string): Response {
  validateDisabledCallbackInput(new URL(requestUrl));

  return buildDisabledEntraAuthResponse("callback");
}

