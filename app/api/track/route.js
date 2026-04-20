import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id'));
  const url = searchParams.get('url');

  const links = db.getLinks();
  const link = links.find(l => l.id === id);
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

  return NextResponse.redirect(url);
}
