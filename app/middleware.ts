import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Route → Allowed Roles
const roleAccessMap: Record<string, string[]> = {
  "/superadmin": ["superadmin"],
  "/admin": ["admin", "superadmin"],
  "/technician": ["technician"],
  "/customer": ["customer"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // ✅ Get token from cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userRole = decoded.role;

    // ✅ Role based protection
    for (const route in roleAccessMap) {
      if (pathname.startsWith(route)) {
        if (!roleAccessMap[route].includes(userRole)) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/superadmin/:path*",
    "/admin/:path*",
    "/technician/:path*",
    "/customer/:path*",
  ],
};
