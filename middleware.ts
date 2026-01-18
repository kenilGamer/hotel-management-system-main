import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Public routes - allow access
  if (
    path.startsWith("/signin") ||
    path.startsWith("/signup") ||
    path === "/" ||
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  // Check for NextAuth session cookie
  // NextAuth v5 uses different cookie names, check for common ones
  const sessionToken = 
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value

  // Protected routes require authentication
  if (path.startsWith("/admin") || path.startsWith("/customer")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/signin", req.url))
    }
  }

  // Note: Detailed role-based access control is handled in server components
  // using requireAdminOrStaff() and requireAdmin() functions
  // This middleware only checks for basic authentication

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/:path*",
    "/signin",
    "/signup",
  ],
}
