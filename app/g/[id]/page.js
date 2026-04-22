import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { pick, readLangFromCookie } from '@/lib/i18n';
import LinksView from '../../_components/LinksView';

export const dynamic = 'force-dynamic';

export default async function Group({ params }) {
  const { id } = await params;
  const gid = parseInt(id);
  if (!Number.isFinite(gid)) notFound();

  const lang = await readLangFromCookie(cookies);
  const allLinks = [...db.getLinks()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const group = allLinks.find((l) => l.id === gid && l.isGroup);
  if (!group) notFound();

  const children = allLinks.filter((l) => l.parentId === gid);
  const social = [...db.getSocial()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const config = db.getPublicConfig();

  return (
    <LinksView
      title={pick(group, 'title', lang)}
      tagline={pick(group, 'tagline', lang)}
      logo={group.icon || config.siteLogo}
      links={children}
      social={social}
      config={config}
      lang={lang}
      back="/"
    />
  );
}
