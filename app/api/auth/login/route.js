import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, isPasswordHashed, setAuthCookie, verifyPassword } from '@/lib/auth';

export async function POST(request) {
  const { username, password } = await request.json();
  const config = db.getConfig();

  if (!config.setupCompleted) {
    return NextResponse.json({ error: 'Initial setup is required.', setupRequired: true }, { status: 409 });
  }

  if (username === 'admin' && verifyPassword(password, config.adminPassword)) {
    // Upgrade legacy plaintext passwords after the first successful login.
    if (!isPasswordHashed(config.adminPassword)) {
      db.saveConfig({ adminUsername: 'admin', adminPassword: hashPassword(password) });
    }
    const response = NextResponse.json({ success: true });
    setAuthCookie(response, db.getConfig());
    return response;
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
