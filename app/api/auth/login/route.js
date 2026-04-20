import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  const { username, password } = await request.json();
  const config = db.getConfig();
  
  if (username === config.adminUsername && password === config.adminPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return response;
  }
  
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
