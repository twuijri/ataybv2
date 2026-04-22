import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const detectStore = (ua = '') => {
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id'));
  const overrideUrl = searchParams.get('url');

  const links = db.getLinks();
  const link = links.find(l => l.id === id);

  let target = overrideUrl;
  if (!target && link) {
    if (link.linkType === 'app') {
      const ua = request.headers.get('user-agent') || '';
      const store = detectStore(ua);
      if (store === 'ios' && link.appStoreUrl) target = link.appStoreUrl;
      else if (store === 'android' && link.playStoreUrl) target = link.playStoreUrl;
      else target = link.playStoreUrl || link.appStoreUrl || link.url;
    } else {
      target = link.url;
    }
  }

  if (link) {
    link.clicks = (link.clicks || 0) + 1;
    db.saveLinks(links);
  }

  const stats = db.getStats();
  stats.link_clicks = (stats.link_clicks || 0) + 1;
  stats.history = stats.history || [];
  stats.history.push({ type: 'click', ts: Date.now(), linkId: id });
  if (stats.history.length > 5000) stats.history = stats.history.slice(-5000);
  db.saveStats(stats);

  if (!target) return NextResponse.json({ error: 'No destination URL' }, { status: 400 });
  return NextResponse.redirect(target);
}
