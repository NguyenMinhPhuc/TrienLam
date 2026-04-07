import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Logout Error:', err);
    return NextResponse.json({ error: 'System error' }, { status: 500 });
  }
}
