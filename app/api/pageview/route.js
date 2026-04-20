import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  const stats = db.getStats();
  stats.page_views = (stats.page_views || 0) + 1;
  stats.history = stats.history || [];
  stats.history.push({ type: 'view', ts: Date.now() });
  if (stats.history.length > 5000) stats.history = stats.history.slice(-5000);
  db.saveStats(stats);
  return NextResponse.json({ success: true });
}
