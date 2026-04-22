import SocialIcon, { SOCIAL_LABELS, SOCIAL_LABELS_EN } from './SocialIcon';
import BackgroundVideo from './BackgroundVideo';
import LangToggle from './LangToggle';
import { pick, tr } from '@/lib/i18n';

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

export default function LinksView({ title, tagline, logo, links, social, config, back, lang = 'ar' }) {
  const radius = Number.isFinite(config.buttonRadius) ? config.buttonRadius : 18;
  const overlay = Number.isFinite(config.overlayOpacity) ? config.overlayOpacity : 0.55;
  const glassOp = Number.isFinite(config.glassOpacity) ? config.glassOpacity : 0.1;
  const glassBlur = Number.isFinite(config.glassBlur) ? config.glassBlur : 18;
  const glassBorderOp = Number.isFinite(config.glassBorderOpacity) ? config.glassBorderOpacity : 0.22;
  const dir = lang === 'en' ? 'ltr' : 'rtl';
  const socialLabels = lang === 'en' ? SOCIAL_LABELS_EN : SOCIAL_LABELS;

  return (
    <main dir={dir} className="relative min-h-screen overflow-hidden" style={{ color: config.textColor || '#ffffff' }}>
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

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-5 pb-10 pt-6">
        <div className="mb-6 flex w-full items-center justify-between">
          {back ? (
            <a
              href={back}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm ring-1 ring-white/25 backdrop-blur-sm hover:bg-white/25"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={dir === 'rtl' ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'} />
              </svg>
              {tr('back', lang)}
            </a>
          ) : <span />}
          <LangToggle lang={lang} />
        </div>

        <div className="fade-in mb-6 flex flex-col items-center text-center">
          {logo ? (
            <div className="logo-float mb-4 h-24 w-24 overflow-hidden rounded-full bg-white/15 p-1 ring-1 ring-white/30 backdrop-blur-md">
              <img src={logo} alt={title || ''} className="h-full w-full rounded-full object-cover" />
            </div>
          ) : (
            <div
              className="logo-float mb-4 flex h-24 w-24 items-center justify-center rounded-full ring-1 ring-white/30"
              style={{ background: `linear-gradient(135deg, ${config.accentColor || '#D4A95A'}, ${config.brandColor || '#8B5E34'})` }}
            >
              <span className="text-3xl font-bold text-white/95">{(title || 'A').slice(0, 1)}</span>
            </div>
          )}

          <h1
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.55)' }}
          >
            {title}
          </h1>
          {tagline && <p className="mt-1.5 max-w-xs text-sm opacity-90 sm:text-base">{tagline}</p>}
        </div>

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
              const label = pick(link, 'title', lang) || link.title;
              const href = link.isGroup ? `/g/${link.id}` : `/api/track?id=${link.id}`;
              const external = !link.isGroup;
              const arrowPath = link.isGroup
                ? (dir === 'rtl' ? 'M9 18l-6-6 6-6' : 'M15 18l-6-6 6-6')
                : (dir === 'rtl' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6');
              return (
                <a
                  key={link.id}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="link-btn group relative flex items-center gap-3 overflow-hidden px-3.5 py-3 font-bold"
                  style={{
                    borderRadius: radius,
                    background: bg,
                    color: textLight ? '#ffffff' : '#1F140A',
                    boxShadow: '0 8px 22px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.35)',
                    textAlign: dir === 'rtl' ? 'right' : 'left'
                  }}
                >
                  {link.icon ? (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/85 ring-1 ring-black/5">
                      <img src={link.icon} alt="" className="h-9 w-9 object-contain" />
                    </span>
                  ) : (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/5 text-xl">
                      {link.isGroup ? '📂' : link.linkType === 'app' ? '📱' : '🛵'}
                    </span>
                  )}
                  <span className="flex-1 text-base sm:text-[17px]">{label}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" className="opacity-60 transition group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={arrowPath} />
                  </svg>
                </a>
              );
            })}

            {links.length === 0 && (
              <div className="rounded-2xl bg-white/10 p-5 text-center text-sm">
                {tr('noLinks', lang)}
              </div>
            )}
          </div>

          {social && social.length > 0 && (
            <>
              <div className="my-5 h-px w-full bg-white/15" />
              <div className="flex flex-wrap items-center justify-center gap-3">
                {social.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLabels[s.platform] || s.platform}
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

        <div className="mt-auto pt-8 text-center text-xs opacity-75">
          {pick(config, 'footerText', lang)}
        </div>
      </div>
    </main>
  );
}
