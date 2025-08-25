import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
// import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
   // Check for session cookies first
   const sessionCookie =
      request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token");

   const url = request.nextUrl;
   // console.log(
   //    "Session Cookie:",
   //    sessionCookie?.value ? "Exists" : "Not found"
   // );
   // console.log("Requested URL:", url.pathname);

   // Try to get token for additional debugging
   // const token = await getToken({
   //    req: request,
   //    secret: process.env.TOKEN_SECRET,
   // });
   // console.log("Token from getToken:", token ? "Exists" : "Null");
   // if (!token) {console.log("No token found, checking session cookie instead.");}

   const isAuthenticated = !!sessionCookie;

   // If user is logged in, redirect from auth pages to dashboard
   if (
      isAuthenticated &&
      (url.pathname.startsWith("/login") ||
         url.pathname.startsWith("/signup") ||
         url.pathname.startsWith("/verify"))
   ) {
      // console.log("Redirecting authenticated user from auth page to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
   }

   // If user is not logged in, redirect from protected pages to login
   if (
      !isAuthenticated &&
      (url.pathname.startsWith("/dashboard") ||
         url.pathname.startsWith("/messages") ||
         url.pathname.startsWith("/settings"))
   ) {
      // console.log("Redirecting unauthenticated user from protected page to login");
      return NextResponse.redirect(new URL("/login", request.url));
   }

   return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
   matcher: [
      "/login",
      "/signup",
      "/verify/:path*",
      "/dashboard/:path*",
      "/messages/:path*",
      "/settings/:path*",
   ],
};
