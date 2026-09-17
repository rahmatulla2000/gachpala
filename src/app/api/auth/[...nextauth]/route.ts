import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const authHandler = NextAuth(authOptions);

async function handler(req: NextRequest, ctx: any) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  if (host && (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes('localhost'))) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  return authHandler(req, ctx);
}

export { handler as GET, handler as POST };
