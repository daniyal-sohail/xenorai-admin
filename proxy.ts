import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow Next.js internals and static assets only
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname === "/favicon.ico" ||
        pathname === "/manifest.json" ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)
    ) {
        return NextResponse.next();
    }

    // Block everything except the landing page root "/"
    if (pathname !== "/") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$).*)',
    ],
};
