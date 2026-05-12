import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get("khandaan_auth");
  const isAuthenticated = authCookie?.value === "true";

  // Phase 6: Protect specific premium routes
  const protectedRoutes = ["/family-tree", "/gallery", "/timeline"];
  const isProtectedPath = protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path));

  // If not logged in -> redirect to /login
  if (isProtectedPath && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
