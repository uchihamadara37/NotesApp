

import { NextRequest, NextResponse } from 'next/server';
// console.log("jangkrik middleware2");

export function middleware(req: NextRequest) {
    console.log("jangkrik middleware frontend");
    // console.log("Middleware executed url:", req.nextUrl);


    const { pathname } = req.nextUrl
    const response = NextResponse.next()
    console.log('Middleware executed:', pathname)

    // === Handle CORS untuk /api/:path* ===
    // if (pathname.startsWith('/api')) {
    // console.log("akses ke api")
    // const allowedOrigins = [
    //     'https://8080-cs-a6858464-1a31-44a9-b787-295e6771a781.cs-asia-southeast1-yelo.cloudshell.dev',
    //     'https://3000-cs-a6858464-1a31-44a9-b787-295e6771a781.cs-asia-southeast1-yelo.cloudshell.dev',
    //     'http://localhost:3000',
    //     'http://localhost:8080',
    //     'https://c-01-450604.uc.r.appspot.com',
    //     'https://andre-next-frontend-dot-c-01-450604.uc.r.appspot.com'
    // ]

    // const origin = req.headers.get('origin')
    // if (origin && allowedOrigins.includes(origin)) {
    //     response.headers.set('Access-Control-Allow-Origin', origin)
    //     response.headers.set('Access-Control-Allow-Credentials', 'true')
    // }

    // Handle preflight
    // if (req.method === 'OPTIONS') {
    //     response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    //     response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    //     return response
    // }

    //     return response // skip auth check if /api
    // }

    // === Auth Check untuk halaman tertentu ===
    const token = req.cookies.get('firebase-auth-token')
    console.log("firebase-auth-token : ", token)

    // if (!token) {
    //     return NextResponse.redirect(new URL('/sign-in', req.url))
    // }

    return response
}

export const config = {
    matcher: ['/', '/dashboard/:path*', '/api/:path*'], // Tentukan halaman yang perlu login
};


