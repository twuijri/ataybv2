import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request) {
  if (!(await isAuthenticated())) {
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
