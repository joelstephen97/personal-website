import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next 16's `proxy.ts` replaces `middleware.ts`. For now this only gates
 * `/dev/*`: those routes 404 in production so the token/component
 * reference never ships to real visitors. Task 11 extends this file with
 * CSP headers — keep this minimal until then.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dev") && process.env.VERCEL_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dev/:path*"],
};
