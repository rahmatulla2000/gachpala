import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow the login page
  if (pathname === '/admin/login') {
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Protect all other /admin/* routes
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'knows-about-tree-secret-key-2024-dev';
  const token = await getToken({
    req,
    secret,
    secureCookie: req.url.startsWith('https://'),
  });

  if (!token) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
