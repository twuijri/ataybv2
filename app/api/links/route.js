import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

async function requireAuth() {
  const store = await cookies();
  const token = store.get('auth_token');
  return token && token.value === 'authenticated';
}

export async function GET() {
  const links = db.getLinks();
  links.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return NextResponse.json(links);
}

export async function POST(request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { title, url, icon, color, colorOpacity } = await request.json();
  const links = db.getLinks();

  const newLink = {
    id: links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1,
    title,
    url,
    icon: icon || null,
    color: color || null,
    colorOpacity: Number.isFinite(colorOpacity) ? colorOpacity : 1,
    clicks: 0,
    order: links.length
  };

  links.push(newLink);
  db.saveLinks(links);
  return NextResponse.json(newLink);
}

export async function PUT(request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, title, url, icon, color, colorOpacity } = await request.json();
  const links = db.getLinks();
  const link = links.find(l => l.id === id);
  if (!link) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (title !== undefined) link.title = title;
  if (url !== undefined) link.url = url;
  if (icon !== undefined) link.icon = icon;
  if (color !== undefined) link.color = color;
  if (colorOpacity !== undefined) link.colorOpacity = colorOpacity;
  db.saveLinks(links);
  return NextResponse.json(link);
}

export async function DELETE(request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id'));
  const links = db.getLinks();
  const filtered = links.filter(l => l.id !== id);
  db.saveLinks(filtered);
  return NextResponse.json({ success: true });
}
