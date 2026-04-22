'use client';

import { useRouter } from 'next/navigation';

export default function LangToggle({ lang }) {
  const router = useRouter();
  const switchTo = (l) => {
    if (l === lang) return;
    document.cookie = `lang=${l};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  };
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/15 p-1 text-xs ring-1 ring-white/25 backdrop-blur-sm">
      <button
        onClick={() => switchTo('ar')}
        className={`rounded-full px-3 py-1 font-bold transition ${lang === 'ar' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white'}`}
      >
        عربي
      </button>
      <button
        onClick={() => switchTo('en')}
        className={`rounded-full px-3 py-1 font-bold transition ${lang === 'en' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white'}`}
      >
        EN
      </button>
    </div>
  );
}
