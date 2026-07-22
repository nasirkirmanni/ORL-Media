import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, SITE_NAME } from '../lib/schema';

/* ─────────────────────────────────────────────────────────────
   RSS 2.0 feed for The ORL Journal.

   Why hand-rolled rather than @astrojs/rss: the feed is ~20 lines
   of XML and adding a dependency to generate it is not a trade
   worth making. No runtime cost either way — this is prerendered
   to a static file at build time.

   Why bother at all: a feed is a first-class discovery surface for
   aggregators, newsreaders and several AI crawlers, and it is the
   cheapest way to signal publication cadence and freshness. The
   site publishes long-form research and had no feed.
   ───────────────────────────────────────────────────────────── */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  /* pubDate below is the ORIGINAL publication date, never `updated`. Feeding
     an edit date into pubDate resurfaces an old post as new in every reader
     the next time it is touched. Dormant today only because no post carries
     `updated` yet — which is exactly when it is cheapest to fix. */
  const items = posts
    .map((p) => {
      const url = `${SITE}/blog/${p.id}/`;
      return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.data.description)}</description>
      <category>${esc(p.data.category)}</category>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The ORL Journal — ${esc(SITE_NAME)}</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Field notes on AI search visibility, buying-window intelligence, deal-stage proof and pipeline economics for B2B SaaS.</description>
    <language>en-us</language>
    <lastBuildDate>${(posts[0]?.data.updated ?? posts[0]?.data.date ?? new Date()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
