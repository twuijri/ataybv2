import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

async function requireAuth() {
  const store = await cookies();
  const token = store.get('auth_token');
  return token && token.value === 'authenticated';
}

export async function POST(request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { ids, type = 'links' } = await request.json();

  if (type === 'social') {
    const list = db.getSocial();
    const map = new Map(list.map(s => [s.id, s]));
    const ordered = ids.map((id, i) => {
      const item = map.get(id);
      if (item) item.order = i;
      return item;
    }).filter(Boolean);
    db.saveSocial(ordered);
    return NextResponse.json({ success: true });
  }

  const links = db.getLinks();
  const map = new Map(links.map(l => [l.id, l]));
  const ordered = ids.map((id, i) => {
    const l = map.get(id);
    if (l) l.order = i;
    return l;
  }).filter(Boolean);
  db.saveLinks(ordered);
  return NextResponse.json({ success: true });
}
