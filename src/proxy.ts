import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('lhu_admin_session')?.value;

  if (pathname.startsWith('/admin') && pathname !== '/admin' && session !== 'authenticated') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login' && session !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (pathname === '/admin' && session === 'authenticated') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
