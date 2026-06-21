import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION = process.env.ADMIN_SESSION_TOKEN ?? "bd-owner-session-v1";

export function middleware(req: NextRequest) {
  const authed = req.cookies.get("bd_session")?.value === SESSION;
  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
