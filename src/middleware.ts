import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXT_AUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const url = req.nextUrl.clone();  // Clone the URL to safely modify it

  const isAuthPage =
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify");

  const isDashboardPage = url.pathname.startsWith("/dashboard");

  if (token && isAuthPage) {
    // If authenticated and on an auth page, redirect to dashboard
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (!token && isDashboardPage) {
    // If not authenticated and trying to access dashboard, redirect to sign-in
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-up", "/sign-in", "/dashboard/:path*", "/verify/:path*"],
};
