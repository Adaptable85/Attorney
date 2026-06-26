import { NextResponse } from "next/server";

import {
  adminPasswordSessionCookieName,
  createAdminPasswordSessionCookieValue,
  getAdminPasswordAccessConfig,
  getAdminPasswordCookieOptions,
  verifyAdminPassword
} from "@/auth/admin-password-access";

function redirectToSignIn(request: Request, error?: "invalid") {
  const url = new URL("/admin/sign-in", request.url);

  if (error) {
    url.searchParams.set("error", error);
  }

  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  const config = getAdminPasswordAccessConfig();
  const formData = await request.formData();
  const password = formData.get("password");

  if (typeof password !== "string" || !verifyAdminPassword(password, config)) {
    return redirectToSignIn(request, "invalid");
  }

  const cookieValue = createAdminPasswordSessionCookieValue(config);

  if (!cookieValue) {
    return redirectToSignIn(request, "invalid");
  }

  const response = new NextResponse(null, {
    status: 303,
    headers: {
      Location: "/admin"
    }
  });
  response.cookies.set(
    adminPasswordSessionCookieName,
    cookieValue,
    getAdminPasswordCookieOptions()
  );

  return response;
}
