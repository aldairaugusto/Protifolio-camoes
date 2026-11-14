import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/jwt";

export const config = { matcher: ["/admin/:path*"] };

export async function middleware(req: NextRequest) {
  const session = await verifyToken(req.cookies.get(COOKIE_NAME)?.value);
  const isLogin = req.nextUrl.pathname === "/admin/login";

  if (!session && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}
