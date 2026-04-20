import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

async function requireAuth() {
  const store = await cookies();
  const token = store.get('auth_token');
  return token && token.value === 'authenticated';
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const c = db.getConfig();
  return NextResponse.json({ adminUsername: c.adminUsername });
}

export async function PUT(request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { currentPassword, newUsername, newPassword } = await request.json();
  const c = db.getConfig();
  if (currentPassword !== c.adminPassword) {
    return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
  }
  const update = {};
  if (newUsername && newUsername.trim()) update.adminUsername = newUsername.trim();
  if (newPassword && newPassword.length >= 4) update.adminPassword = newPassword;
  db.saveConfig(update);
  return NextResponse.json({ success: true });
}
