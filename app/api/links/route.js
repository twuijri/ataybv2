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
  const body = await request.json();
  const {
    title, title_en, url, icon, color, colorOpacity,
    isGroup, parentId, tagline, tagline_en,
    linkType, appStoreUrl, playStoreUrl
  } = body;
  const links = db.getLinks();

  const newLink = {
    id: links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1,
    title,
    title_en: title_en || null,
    url: isGroup ? null : (url || null),
    icon: icon || null,
    color: color || null,
    colorOpacity: Number.isFinite(colorOpacity) ? colorOpacity : 1,
    isGroup: !!isGroup,
    parentId: Number.isFinite(parentId) ? parentId : null,
    tagline: tagline || null,
    tagline_en: tagline_en || null,
    linkType: linkType === 'app' ? 'app' : 'general',
    appStoreUrl: appStoreUrl || null,
    playStoreUrl: playStoreUrl || null,
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
  const body = await request.json();
  const {
    id, title, title_en, url, icon, color, colorOpacity,
    isGroup, parentId, tagline, tagline_en,
    linkType, appStoreUrl, playStoreUrl
  } = body;
  const links = db.getLinks();
  const link = links.find(l => l.id === id);
  if (!link) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (title !== undefined) link.title = title;
  if (title_en !== undefined) link.title_en = title_en || null;
  if (url !== undefined) link.url = url || null;
  if (icon !== undefined) link.icon = icon;
  if (color !== undefined) link.color = color;
  if (colorOpacity !== undefined) link.colorOpacity = colorOpacity;
  if (isGroup !== undefined) link.isGroup = !!isGroup;
  if (parentId !== undefined) link.parentId = Number.isFinite(parentId) ? parentId : null;
  if (tagline !== undefined) link.tagline = tagline || null;
  if (tagline_en !== undefined) link.tagline_en = tagline_en || null;
  if (linkType !== undefined) link.linkType = linkType === 'app' ? 'app' : 'general';
  if (appStoreUrl !== undefined) link.appStoreUrl = appStoreUrl || null;
  if (playStoreUrl !== undefined) link.playStoreUrl = playStoreUrl || null;
  if (link.isGroup) { link.url = null; link.linkType = 'general'; link.appStoreUrl = null; link.playStoreUrl = null; }
  if (link.id === link.parentId) link.parentId = null;
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
  const filtered = links.filter(l => l.id !== id).map(l => (
    l.parentId === id ? { ...l, parentId: null } : l
  ));
  db.saveLinks(filtered);
  return NextResponse.json({ success: true });
}
