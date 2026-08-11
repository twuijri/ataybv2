import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, setAuthCookie } from '@/lib/auth';

export async function GET() {
  const config = db.getConfig();
  return NextResponse.json(
    { setupRequired: !config.setupCompleted, username: 'admin' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request) {
  const config = db.getConfig();
  if (config.setupCompleted) {
    return NextResponse.json({ error: 'Setup has already been completed.' }, { status: 409 });
  }

  const { password, confirmPassword } = await request.json();
  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
  }

  db.saveConfig({
    adminUsername: 'admin',
    adminPassword: hashPassword(password),
    setupCompleted: true
  });

  const response = NextResponse.json({ success: true, username: 'admin' });
  setAuthCookie(response, db.getConfig());
  return response;
}
