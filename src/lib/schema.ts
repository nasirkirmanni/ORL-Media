/* ─────────────────────────────────────────────────────────────
   schema.ts — JSON-LD builders.

   Every builder takes the SAME data the page renders visibly, so
   the structured data can't drift from the copy. Hand-writing a
   second copy of the facts is how schema goes stale and starts
   lying to crawlers.
   ───────────────────────────────────────────────────────────── */

export const SITE = 'https://orlmedia.com';
export const SITE_NAME = 'ORL Media';

const abs = (path: string) => new URL(path, SITE).href;

/* The organization node every other node points back to. */
export const organization = () => ({
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: SITE_NAME,
  url: SITE,
  description:
    'ORL Media installs growth infrastructure for B2B SaaS and AI companies — AI search visibility, buying-signal intelligence, deal-stage proof, and monetization systems on one analytics layer.',
  slogan: 'We don’t run your marketing. We install the machine.',
  knowsAbout: [
    'GTM infrastructure',
    'Buying window intelligence',
    'Answer engine optimization',
    'Intent data',
    'Revenue operations',
    'B2B SaaS pipeline generation',
  ],
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: SITE_NAME,
  publisher: { '@id': `${SITE}/#organization` },
  inLanguage: 'en-US',
});

/** Wrap nodes in a single @graph document — one script tag per page. */
export const graph = (nodes: object[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: abs(t.path),
  })),
});

export const article = (a: {
  title: string;
  description: string;
  path: string;
  published: Date;
  section: string;
  wordCount?: number;
}) => ({
  '@type': 'Article',
  '@id': `${abs(a.path)}#article`,
  headline: a.title,
  description: a.description,
  url: abs(a.path),
  datePublished: a.published.toISOString(),
  dateModified: a.published.toISOString(),
  articleSection: a.section,
  ...(a.wordCount ? { wordCount: a.wordCount } : {}),
  author: { '@id': `${SITE}/#organization` },
  publisher: { '@id': `${SITE}/#organization` },
  isPartOf: { '@id': `${SITE}/#website` },
  inLanguage: 'en-US',
});

export const service = (s: {
  name: string;
  description: string;
  path: string;
}) => ({
  '@type': 'Service',
  '@id': `${abs(s.path)}#service`,
  name: `ORL ${s.name}`,
  serviceType: s.name,
  description: s.description,
  url: abs(s.path),
  provider: { '@id': `${SITE}/#organization` },
  areaServed: 'Worldwide',
  audience: {
    '@type': 'BusinessAudience',
    name: 'B2B SaaS and AI companies, $1M–$20M ARR',
  },
});

/* FAQ schema is on-thesis: it is one of the formats answer engines
   quote most readily — which is exactly what Visibility sells. */
export const faqPage = (qs: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: qs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});
