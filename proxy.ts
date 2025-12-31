// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const userId = request.cookies.get("user_id");
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  // 1. Not logged in -> Go to Login
  if (!userId && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Already logged in -> Go to Dashboard (if trying to visit login)
  if (userId && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
