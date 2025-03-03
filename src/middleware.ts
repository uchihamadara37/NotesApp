import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    console.log("Middleware executed:", req.nextUrl.pathname);

    const token = req.cookies.get('firebase-auth-token'); // Sesuaikan dengan cara menyimpan token

    if (!token) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*'], // Tentukan halaman yang perlu login
};
