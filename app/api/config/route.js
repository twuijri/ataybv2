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
  return NextResponse.json(db.getConfig());
}

export async function PUT(request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { adminUsername, adminPassword, ...safe } = body;
  db.saveConfig(safe);
  return NextResponse.json({ success: true });
}
