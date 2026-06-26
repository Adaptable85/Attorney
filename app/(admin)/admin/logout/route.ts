import { NextResponse } from "next/server";

import {
  adminPasswordSessionCookieName,
  getAdminPasswordCookieOptions
} from "@/auth/admin-password-access";

export function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/sign-in", request.url));
  response.cookies.set(adminPasswordSessionCookieName, "", {
    ...getAdminPasswordCookieOptions(),
    maxAge: 0
  });

  return response;
}
