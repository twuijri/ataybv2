import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(db.getSocial());
}

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { platform, url } = await request.json();
  const list = db.getSocial();
  const item = {
    id: list.length ? Math.max(...list.map(s => s.id)) + 1 : 1,
    platform,
    url,
    order: list.length
  };
  list.push(item);
  db.saveSocial(list);
  return NextResponse.json(item);
}

export async function PUT(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, platform, url } = await request.json();
  const list = db.getSocial();
  const item = list.find(s => s.id === id);
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (platform !== undefined) item.platform = platform;
  if (url !== undefined) item.url = url;
  db.saveSocial(list);
  return NextResponse.json(item);
}

export async function DELETE(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id'));
  db.saveSocial(db.getSocial().filter(s => s.id !== id));
  return NextResponse.json({ success: true });
}
