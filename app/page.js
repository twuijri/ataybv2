import { db } from '@/lib/db';
import SocialIcon, { SOCIAL_LABELS } from './_components/SocialIcon';
import PageViewTracker from './_components/PageViewTracker';
import BackgroundVideo from './_components/BackgroundVideo';

export const dynamic = 'force-dynamic';

export default function Home() {
  const links = [...db.getLinks()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const social = [...db.getSocial()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const config = db.getPublicConfig();

  const radius = Number.isFinite(config.buttonRadius) ? config.buttonRadius : 18;
  const overlay = Number.isFinite(config.overlayOpacity) ? config.overlayOpacity : 0.55;
  const glassOp = Number.isFinite(config.glassOpacity) ? config.glassOpacity : 0.1;
  const glassBlur = Number.isFinite(config.glassBlur) ? config.glassBlur : 18;
  const glassBorderOp = Number.isFinite(config.glassBorderOpacity) ? config.glassBorderOpacity : 0.22;

  const hexToRgba = (hex, a = 1) => {
    if (!hex) return null;
    const h = hex.replace('#', '');
    const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    if (n.length !== 6) return hex;
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ color: config.textColor || '#ffffff' }}>
      <PageViewTracker />

      {/* Background layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 800px at 50% -10%, #C9884A 0%, #8B5E34 40%, #5C3A1E 80%, #3A2412 100%)'
        }}
      >
        {config.backgroundVideo ? (
          <BackgroundVideo src={config.backgroundVideo} poster={config.backgroundImage} />
        ) : config.backgroundImage ? (
          <img src={config.backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(10,6,2,${overlay * 0.55}) 0%, rgba(10,6,2,${overlay}) 55%, rgba(10,6,2,${Math.min(overlay + 0.2, 0.95)}) 100%)`
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-5 pb-10 pt-10">
        {/* Logo + title above the glass card */}
        <div className="fade-in mb-6 flex flex-col items-center text-center">
          {config.siteLogo ? (
            <div className="logo-float mb-4 h-24 w-24 overflow-hidden rounded-full bg-white/15 p-1 ring-1 ring-white/30 backdrop-blur-md">
              <img src={config.siteLogo} alt={config.siteTitle || ''} className="h-full w-full rounded-full object-cover" />
            </div>
          ) : (
            <div
              className="logo-float mb-4 flex h-24 w-24 items-center justify-center rounded-full ring-1 ring-white/30"
              style={{ background: `linear-gradient(135deg, ${config.accentColor || '#D4A95A'}, ${config.brandColor || '#8B5E34'})` }}
            >
              <span className="text-3xl font-bold text-white/95">{(config.siteTitle || 'A').slice(0, 1)}</span>
            </div>
          )}

          <h1
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.55)' }}
          >
            {config.siteTitle}
          </h1>
          {config.siteTagline && (
            <p className="mt-1.5 max-w-xs text-sm opacity-90 sm:text-base">{config.siteTagline}</p>
          )}
        </div>

        {/* Glassmorphism card */}
        <div
          className="fade-in relative w-full rounded-[28px] p-5 sm:p-6"
          style={{
            background: `rgba(255, 255, 255, ${glassOp})`,
            backdropFilter: `blur(${glassBlur}px) saturate(140%)`,
            WebkitBackdropFilter: `blur(${glassBlur}px) saturate(140%)`,
            border: `1px solid rgba(255, 255, 255, ${glassBorderOp})`,
            boxShadow: '0 20px 60px -20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.15)'
          }}
        >
          <div className="flex flex-col gap-3">
            {links.map((link) => {
              const op = Number.isFinite(link.colorOpacity) ? link.colorOpacity : 1;
              const bg = link.color ? hexToRgba(link.color, op) : `rgba(255,255,255,${op === 1 ? 0.95 : op})`;
              const textLight = !!link.color && op >= 0.5;
              return (
              <a
                key={link.id}
                href={`/api/track?id=${link.id}&url=${encodeURIComponent(link.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn group relative flex items-center gap-3 overflow-hidden px-3.5 py-3 text-right font-bold"
                style={{
                  borderRadius: radius,
                  background: bg,
                  color: textLight ? '#ffffff' : '#1F140A',
                  boxShadow: '0 8px 22px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.35)'
                }}
              >
                {link.icon ? (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/85 ring-1 ring-black/5">
                    <img src={link.icon} alt="" className="h-9 w-9 object-contain" />
                  </span>
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/5 text-xl">🛵</span>
                )}
                <span className="flex-1 text-base sm:text-[17px]">{link.title}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  className="opacity-60 transition group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </a>
              );
            })}

            {links.length === 0 && (
              <div className="rounded-2xl bg-white/10 p-5 text-center text-sm">
                لا توجد روابط بعد.{' '}
                <a href="/admin" className="underline">سجّل الدخول</a>{' '}
                لإضافتها.
              </div>
            )}
          </div>

          {social.length > 0 && (
            <>
              <div className="my-5 h-px w-full bg-white/15" />
              <div className="flex flex-wrap items-center justify-center gap-3">
                {social.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[s.platform] || s.platform}
                    className="link-btn flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm hover:bg-white/25"
                    style={{ color: '#fff' }}
                  >
                    <SocialIcon platform={s.platform} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-auto pt-8 text-center text-xs opacity-75">{config.footerText}</div>
      </div>
    </main>
  );
}
