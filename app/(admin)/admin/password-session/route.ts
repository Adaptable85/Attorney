import { NextResponse } from "next/server";

import {
  adminPasswordSessionCookieName,
  createAdminPasswordSessionCookieValue,
  getAdminPasswordAccessConfig,
  getAdminPasswordCookieOptions,
  verifyAdminPassword
} from "@/auth/admin-password-access";

function redirectToSignIn(error?: "invalid") {
  const location = error ? "/admin/sign-in?error=invalid" : "/admin/sign-in";

  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: location
    }
  });
}

export async function POST(request: Request) {
  const config = getAdminPasswordAccessConfig();
  const formData = await request.formData();
  const password = formData.get("password");

  if (typeof password !== "string" || !verifyAdminPassword(password, config)) {
    return redirectToSignIn("invalid");
  }

  const cookieValue = createAdminPasswordSessionCookieValue(config);

  if (!cookieValue) {
    return redirectToSignIn("invalid");
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
