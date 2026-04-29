import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: { user?: { email?: string | null } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/app") || pathname.startsWith("/admin")) {
    if (!session?.user) {
      const signInUrl = new URL("/logg-inn", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (pathname.startsWith("/admin")) {
    const email = session?.user?.email ?? "";
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [];
    if (!adminEmails.includes(email)) {
      return NextResponse.redirect(new URL("/app", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
