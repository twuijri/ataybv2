import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, isAuthenticated, verifyPassword } from '@/lib/auth';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ adminUsername: 'admin' });
}

export async function PUT(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { currentPassword, newPassword } = await request.json();
  const c = db.getConfig();
  if (!verifyPassword(currentPassword, c.adminPassword)) {
    return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
  }
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
  }
  db.saveConfig({ adminUsername: 'admin', adminPassword: hashPassword(newPassword) });
  return NextResponse.json({ success: true });
}
