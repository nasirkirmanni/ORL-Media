/* ─────────────────────────────────────────────────────────────
   schema.ts — JSON-LD builders.

   Every builder takes the SAME data the page renders visibly, so
   the structured data can't drift from the copy. Hand-writing a
   second copy of the facts is how schema goes stale and starts
   lying to crawlers.
   ───────────────────────────────────────────────────────────── */

export const SITE = 'https://www.orlmedia.agency';
export const SITE_NAME = 'ORL Media';

const abs = (path: string) => new URL(path, SITE).href;

/* ─────────────────────────────────────────────────────────────
   ⚠ TODO(orl) — PLACEHOLDERS BELOW MUST BE REPLACED BEFORE DEPLOY

   Grep this file for "TODO(orl)". Every one emits a factual claim
   to crawlers. Structured data that contradicts reality is worse
   than no structured data — engines treat the mismatch as a
   quality signal against you, and a sameAs pointing at a 404 is
   a weaker signal than omitting sameAs entirely.

   Rule: if a value isn't real yet, delete the property. Don't
   ship the placeholder.
   ───────────────────────────────────────────────────────────── */

/* Stable node ids. Each node is DEFINED once and referenced by @id
   everywhere else, so the graph has one Organization, one Person,
   one logo — not near-duplicates the engine has to reconcile. */
const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;
const FOUNDER_ID = `${SITE}/#founder`;
const LOGO_ID = `${SITE}/#logo`;

/* ── Placeholder guard ─────────────────────────────────────────
   Structured data that contradicts reality is worse than absent
   structured data: a sameAs pointing at a 404, a logo pointing at
   a missing file, or a literal "TODO — Founder Full Name" byline
   are all checkable claims that are checkably false.

   So placeholders are made UNSHIPPABLE rather than merely commented.
   Any string containing "TODO" is stripped from the emitted JSON-LD
   by prune(), which graph() applies to every node. Fill the real
   value in and the property appears automatically — no other edit.
   ───────────────────────────────────────────────────────────── */
const isTodo = (v: unknown): boolean =>
  typeof v === 'string' ? v.includes('TODO') : false;

/** A bare {'@id': …} cross-reference, which must survive pruning. */
const isRef = (v: any) =>
  v && typeof v === 'object' && '@id' in v && Object.keys(v).length === 1;

/** Recursively drop placeholder values and any node left with no substance. */
const prune = (node: any): any => {
  if (Array.isArray(node)) {
    const kept = node.map(prune).filter((v) => v !== undefined);
    return kept.length ? kept : undefined;
  }
  if (node && typeof node === 'object') {
    if (isRef(node)) return node;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      const p = prune(v);
      if (p !== undefined) out[k] = p;
    }
    /* A node reduced to nothing but @type/@id carries no information —
       drop it so we don't emit hollow shells. */
    const meaningful = Object.keys(out).filter((k) => k !== '@type' && k !== '@id');
    return meaningful.length ? out : undefined;
  }
  if (node === null || node === undefined || isTodo(node)) return undefined;
  return node;
};

/* Derived, not hand-maintained: the Person node ships only once its
   name is real. Until then Article.author falls back to the
   Organization — a truthful corporate byline beats a fabricated human. */
const FOUNDER_NAME = 'TODO — Founder Full Name';
export const FOUNDER_READY = !FOUNDER_NAME.includes('TODO');

/* TODO(orl): no ORL brand mark exists in the repo — public/logos/ holds
   module icons and AI-vendor marks only. Ship a square mark (512×512 min,
   transparent PNG or SVG) to public/logos/, then set LOGO_PATH to it and
   correct the dimensions. Left null so we never claim a logo that 404s. */
const LOGO_PATH: string | null = null;
const LOGO_SIZE = { width: 512, height: 512 };
const LOGO = LOGO_PATH
  ? {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: abs(LOGO_PATH),
      contentUrl: abs(LOGO_PATH),
      ...LOGO_SIZE,
      caption: SITE_NAME,
    }
  : null;

/* The human behind the work.

   Answer engines weight named, credentialed authors far more than a
   faceless brand byline — this node is what turns "ORL Media says"
   into "<name>, <title>, says". It is the single highest-leverage
   addition to this graph.

   Defined inline at Organization.founder (below) and referenced by
   @id from Article.author, so exactly one Person exists per page. */
export const person = () => ({
  '@type': 'Person',
  '@id': FOUNDER_ID,
  // TODO(orl): real full name, spelled as it appears on LinkedIn —
  // engines match the string across sources to resolve the entity.
  name: FOUNDER_NAME,
  // TODO(orl): real title, e.g. 'Founder & Principal, ORL Media'.
  jobTitle: 'TODO — Job Title',
  // TODO(orl): 1–2 sentence bio. Lead with the credential that makes
  // this person worth quoting on GTM/AEO — years in-market, categories
  // shipped, notable outcomes. Not adjectives.
  description:
    'TODO — Short bio establishing first-hand expertise in B2B SaaS growth infrastructure and answer engine optimization.',
  url: abs('/about/'),
  worksFor: { '@id': ORG_ID },
  // TODO(orl): personal profiles — LinkedIn at minimum. Delete any
  // line whose profile does not exist.
  sameAs: [
    'https://www.linkedin.com/in/TODO-founder-handle/',
    'https://x.com/TODO-founder-handle',
  ],
});

/* The organization node every other node points back to. */
export const organization = () => ({
  '@type': 'Organization',
  '@id': ORG_ID,
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
  /* sameAs is how an engine reconciles this site with our off-site
     profiles into ONE entity. Without it, the brand and its LinkedIn
     /G2 presence look like unrelated things — which is most of why a
     young domain reads as "unknown" to answer engines. */
  // TODO(orl): replace all four with real profile URLs. DELETE any
  // line for a profile that doesn't exist yet.
  sameAs: [
    'https://www.linkedin.com/company/TODO-orl-media/',
    'https://www.crunchbase.com/organization/TODO-orl-media',
    'https://www.g2.com/sellers/TODO-orl-media',
    'https://x.com/TODO-orl-media',
  ],
  /* logo/image ship together or not at all — an ImageObject pointing at a
     missing file is a broken claim, and a dangling {'@id': LOGO_ID} image
     reference is worse than no image property. */
  ...(LOGO ? { logo: LOGO, image: { '@id': LOGO_ID } } : {}),
  // TODO(orl): real founding/incorporation date, ISO 8601 (YYYY-MM-DD).
  // Pruned until the TODO marker is removed — do not guess a date.
  foundingDate: 'TODO — YYYY-MM-DD',
  /* Defined INLINE, not by reference — this is what puts the Person node
     into the graph on every page so Article.author can resolve against it.

     Gated on FOUNDER_READY rather than left to prune(): a Person stripped
     down to a url and a worksFor is a nameless entity, which is worse than
     no founder property at all. All-or-nothing is the honest shape. */
  ...(FOUNDER_READY ? { founder: person() } : {}),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    // TODO(orl): real monitored sales inbox.
    email: 'TODO@orlmedia.agency',
    url: abs('/book/'),
    availableLanguage: ['en'],
  },
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE,
  name: SITE_NAME,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-US',
});

/** Wrap nodes in a single @graph document — one script tag per page. */
export const graph = (nodes: object[]) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    /* prune() runs here so EVERY node on every page is guaranteed free of
       placeholder values — no page can opt out by forgetting to call it. */
    '@graph': nodes.map(prune).filter(Boolean),
  });

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
  /** Set from the post's optional `updated` frontmatter field. */
  updated?: Date;
  section: string;
  wordCount?: number;
}) => ({
  '@type': 'Article',
  '@id': `${abs(a.path)}#article`,
  headline: a.title,
  description: a.description,
  url: abs(a.path),
  datePublished: a.published.toISOString(),
  /* Falls back to the publish date when a post has never been revised,
     so an un-edited post still carries a truthful dateModified rather
     than a fabricated-fresh one. */
  dateModified: (a.updated ?? a.published).toISOString(),
  articleSection: a.section,
  ...(a.wordCount ? { wordCount: a.wordCount } : {}),
  /* author is a PERSON, publisher stays the ORGANIZATION — that split
     is the point. A brand can publish; only a human can have the
     first-hand experience E-E-A-T asks for, and answer engines quote
     attributed humans far more readily than corporate bylines.
     Resolves against the Person defined at Organization.founder.

     Falls back to the Organization while the Person is placeholder data,
     because a dangling author reference is a schema error and a fake
     human byline is a false claim. Both are worse than a brand byline. */
  author: { '@id': FOUNDER_READY ? FOUNDER_ID : ORG_ID },
  publisher: { '@id': ORG_ID },
  isPartOf: { '@id': WEBSITE_ID },
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
  provider: { '@id': ORG_ID },
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
