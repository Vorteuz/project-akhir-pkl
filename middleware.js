import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // 1. Redirect to login if accessing protected routes without token
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
        if (!token) {
            const url = new URL("/login", req.url);
            url.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(url);
        }
    }

    // 2. Redirect based on role if trying to access wrong portal
    if (token) {
        if (pathname.startsWith("/admin") && token.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        if (pathname.startsWith("/dashboard") && token.role === "admin") {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    // 3. Redirect to dashboard/admin if already logged in and visiting login
    if (pathname === "/login" && token) {
        if (token.role === "admin") {
            return NextResponse.redirect(new URL("/admin", req.url));
        } else {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
