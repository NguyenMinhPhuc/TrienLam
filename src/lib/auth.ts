import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'lhu_admin_session';

export async function login(password: string) {
  const adminPwd = process.env.ADMIN_PASSWORD?.trim();
  
  if (password && password === adminPwd) {
    // In a real app, we'd use a more secure session token
    // For this simple version, we'll store a simple success indicator
    // This is safe because ADMIN_PASSWORD is server-side only
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    return true;
  }
  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function isAuthenticated(req?: NextRequest) {
  if (req) {
    return req.cookies.get(AUTH_COOKIE)?.value === 'authenticated';
  }
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === 'authenticated';
}
