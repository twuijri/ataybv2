import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { pick, readLangFromCookie } from '@/lib/i18n';
import LinksView from './_components/LinksView';
import PageViewTracker from './_components/PageViewTracker';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const lang = await readLangFromCookie(cookies);
  const allLinks = [...db.getLinks()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const topLinks = allLinks.filter((l) => !l.parentId);
  const social = [...db.getSocial()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const config = db.getPublicConfig();

  return (
    <>
      <PageViewTracker />
      <LinksView
        title={pick(config, 'siteTitle', lang)}
        tagline={pick(config, 'siteTagline', lang)}
        logo={config.siteLogo}
        links={topLinks}
        social={social}
        config={config}
        lang={lang}
      />
    </>
  );
}
