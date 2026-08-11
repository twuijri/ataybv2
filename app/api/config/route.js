import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(db.getPublicConfig());
}

export async function PUT(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const safe = { ...body };
  delete safe.adminUsername;
  delete safe.adminPassword;
  delete safe.authSecret;
  delete safe.setupCompleted;
  delete safe.configVersion;
  db.saveConfig(safe);
  return NextResponse.json({ success: true });
}
