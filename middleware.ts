// MIDLERTIDIG: Autentisering deaktivert for visuell testing.
// Skru på igjen før launch.

// import NextAuth from "next-auth";
// import { authConfig } from "@/lib/auth.config";

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth?.user;

//   if (nextUrl.pathname.startsWith("/admin")) {
//     if (!isLoggedIn) {
//       return Response.redirect(new URL("/logg-inn", nextUrl));
//     }
//     const adminEmails =
//       process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [];
//     if (!adminEmails.includes(req.auth?.user?.email ?? "")) {
//       return Response.redirect(new URL("/app", nextUrl));
//     }
//   }

//   if (nextUrl.pathname.startsWith("/app") && !isLoggedIn) {
//     const signInUrl = new URL("/logg-inn", nextUrl);
//     signInUrl.searchParams.set("callbackUrl", nextUrl.href);
//     return Response.redirect(signInUrl);
//   }
// });

export function middleware() {}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
