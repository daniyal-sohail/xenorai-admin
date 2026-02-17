import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Allow only the landing page (root path)
    if (pathname === '/') {
        return NextResponse.next();
    }

    // Redirect all other routes to the landing page
    return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
