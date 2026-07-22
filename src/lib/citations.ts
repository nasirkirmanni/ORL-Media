/* ─────────────────────────────────────────────────────────────
   citations.ts — the source registry.

   WHY THIS EXISTS
   Citing sources is the single highest-ranked GEO factor (Princeton
   /KDD 2024 put it at +40% visibility, top of nine methods tested).
   Every statistic on this site is currently published with no source
   attached — which is both a ranking problem and, for an agency that
   sells evidence-graded AEO, a credibility one.

   WHY A REGISTRY AND NOT INLINE LINKS
   The same claims repeat across the blog, the module pages and the
   homepage — "1.2% cold email reply" appears in at least three
   places. Inline <a> tags would mean maintaining one URL in many
   files and letting them drift. Here, one entry fixes every
   occurrence.

   HOW TO FILL IT IN
   Drop the real URL into `url` and name the publisher in `source`.
   Nothing else needs to change — cite() starts rendering the link
   the moment url is non-null, and stays silent while it is null.
   NEVER guess a URL: a citation pointing at the wrong study is
   worse than no citation, because it is checkable.

   Claim strings below are transcribed verbatim from the published
   copy. Do not reword them here — reword the page, then update this.
   ───────────────────────────────────────────────────────────── */

export type Citation = {
  /** The claim exactly as published on the site. */
  claim: string;
  /** TODO(orl): the source URL. Null = uncited, renders nothing. */
  url: string | null;
  /** TODO(orl): publisher, e.g. 'Gartner', 'Pavilion', 'ProfitWell'. */
  source?: string;
  /** TODO(orl): publication year — freshness matters for stats. */
  year?: number;
};

export const CITATIONS: Record<string, Citation> = {
  /* ── AI search / visibility ─────────────────────────────── */
  'ai-chatbot-eval-71': {
    claim: '71% of B2B buyers use AI chatbots during software evaluation',
    url: null,
  },
  'search-start-57': {
    claim: '57% of decision-makers start with web search',
    url: null,
  },
  'ai-purchase-process-94': {
    claim: '94% of B2B buyers now use generative AI during their purchase process',
    url: null,
  },
  'aio-ctr-8-vs-15': {
    claim: 'organic CTR 8% with an AI Overview vs 15% without',
    url: null,
  },
  'zero-click-60': {
    claim: '~60% of Google searches end with no click',
    url: null,
  },
  'use-case-match-53-vs-7': {
    claim: '53% vs 7% — buyers notice use-case match over brand recognition in AI answers',
    url: null,
  },

  /* ── Demand / buying windows ────────────────────────────── */
  'cold-email-reply-1-2': {
    claim: '1.2% cold email response rate in 2026',
    url: null,
  },
  'not-in-market-95': {
    claim: '95% of your ICP is not in-market at any given moment (roughly 5% is)',
    url: null,
  },
  'day-one-shortlist-95': {
    claim: '95% of winning vendors were on the buyer’s day-one shortlist',
    url: null,
  },
  'job-post-lead-2-3mo': {
    claim: 'a job posting precedes the hire — and the evaluation — by 2–3 months',
    url: null,
  },

  /* ── Deal stage / proof ─────────────────────────────────── */
  'no-decision-89': {
    claim: '89% of sellers report deals stalling into no-decision',
    url: null,
  },
  'win-rate-29-to-19': {
    claim: 'win rates fell from 29% to 19% in a single year',
    url: null,
  },
  'reviews-consulted-74': {
    claim: '74% of buyers consult customer reviews',
    url: null,
  },
  'vendor-collateral-last': {
    claim: 'vendor marketing collateral ranks dead last among resources buyers consult',
    url: null,
  },
  'committee-13-stakeholders': {
    claim: 'a median of 13 stakeholders sit in the buying committee',
    url: null,
  },
  'security-questionnaires-9wk': {
    claim: 'buyers spend 9 weeks/yr on vendor security questionnaires',
    url: null,
  },

  /* ── Pricing / monetization ─────────────────────────────── */
  'repricing-75': {
    claim: '75% of B2B software companies changed pricing or packaging in the past twelve months',
    url: null,
  },
  'hybrid-pricing-25-to-37': {
    claim: 'hybrid pricing jumped from 25% to 37% of companies in a year',
    url: null,
  },
  'ai-credits-126': {
    claim: 'AI credits are growing 126% annually',
    url: null,
  },
  'expansion-cac-half': {
    claim: 'expansion revenue costs roughly half what a new logo does',
    url: null,
  },

  /* ── Retention / NRR ────────────────────────────────────── */
  'nrr-median-98': {
    claim: 'median net revenue retention of ~98% for $1–10M ARR SaaS',
    url: null,
  },
  'nrr-ai-under-50-is-32': {
    claim: 'AI products under $50/month: 32% NRR',
    url: null,
  },
  'nrr-b2b-comparable-82': {
    claim: 'typical B2B SaaS at similar price points: ~82% NRR',
    url: null,
  },
  'nrr-ai-over-250-is-85': {
    claim: 'AI products above $250/month average only ~85% NRR',
    url: null,
  },
  'usage-decline-40-predicts-churn': {
    claim: 'a 40% decline in weekly active usage is the single most reliable early indicator',
    url: null,
  },

  /* ── Efficiency / pipeline economics ────────────────────── */
  'cac-payback-12-15-to-18': {
    claim: 'CAC payback moved from 12–15 months (2023) to 18 months',
    url: null,
  },
  'paid-share-34-to-26': {
    claim: 'paid acquisition’s share of pipeline: 34% in 2023 → 26% in 2026',
    url: null,
  },
  'organic-share-22-to-27': {
    claim: 'organic and content-led channels: 22% → 27% of pipeline',
    url: null,
  },
  'rev-per-employee-100k': {
    claim: 'median revenue per employee at $1–3M ARR is now ~$100K',
    url: null,
  },
  'cmo-tenure-under-2yr': {
    claim: 'CMO tenure averages under two years',
    url: null,
  },
  'ai-native-4-4m-per-head': {
    claim: 'AI-native startups running at $4.4M revenue per head',
    url: null,
  },
};

/** Ids with no source yet — use in a build check or an audit page. */
export const uncited = () =>
  Object.entries(CITATIONS)
    .filter(([, c]) => !c.url)
    .map(([id]) => id);

/**
 * Resolve a citation for rendering. Returns null while `url` is unset,
 * so an uncited claim renders as plain text rather than a dead link.
 */
export const cite = (id: keyof typeof CITATIONS | string) => {
  const c = CITATIONS[id as string];
  if (!c || !c.url) return null;
  return {
    href: c.url,
    label: c.source ? `${c.source}${c.year ? `, ${c.year}` : ''}` : 'Source',
    claim: c.claim,
  };
};
