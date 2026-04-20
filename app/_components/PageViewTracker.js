'use client';

import { useEffect } from 'react';

export default function PageViewTracker() {
  useEffect(() => {
    const key = 'pv_sent_' + new Date().toISOString().slice(0, 10);
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    fetch('/api/pageview', { method: 'POST' }).catch(() => {});
  }, []);
  return null;
}
