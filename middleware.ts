import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/internal-admin");
  const isLoginPage = pathname === "/internal-admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  let user = null;

  if (token) {
    user = await verifyToken(token);
  }

  // Protect all /internal-admin/* routes (except the login page itself)
  if (!isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/internal-admin/login";
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user tries to visit the login page, send to dashboard
  if (isLoginPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/internal-admin";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
