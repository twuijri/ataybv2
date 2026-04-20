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
  const stats = db.getStats();
  const links = db.getLinks();
  const totalClicks = links.reduce((a, l) => a + (l.clicks || 0), 0);
  const conversion = stats.page_views > 0 ? Math.round((totalClicks / stats.page_views) * 100) : 0;

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recent = (stats.history || []).filter(h => h.ts >= sevenDaysAgo);
  const days = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    days[key] = { views: 0, clicks: 0 };
  }
  for (const ev of recent) {
    const key = new Date(ev.ts).toISOString().slice(0, 10);
    if (days[key]) {
      if (ev.type === 'view') days[key].views += 1;
      if (ev.type === 'click') days[key].clicks += 1;
    }
  }

  return NextResponse.json({
    pageViews: stats.page_views || 0,
    linkClicks: totalClicks,
    linkCount: links.length,
    conversion,
    chart: Object.entries(days).map(([date, v]) => ({ date, ...v })),
    topLinks: [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5)
  });
}
