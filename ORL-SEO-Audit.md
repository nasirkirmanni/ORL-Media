# Technical & On-Page SEO Audit — orlmedia.agency

**Audited:** https://www.orlmedia.agency/ · **Date:** 2026-07-22
**Method:** Full 19-page crawl of the production build, live header/redirect/transfer measurement, internal link-graph analysis, browser-rendered schema check (not `curl`/`web_fetch` — see note below).
**Site type:** B2B SaaS/agency marketing site, Astro static, Vercel. 19 pages, 8 blog posts.

> **Schema detection note:** per the audit framework's own warning, `curl` and `web_fetch` strip `<script>` tags and cannot see JS-injected JSON-LD. Schema findings here come from the rendered DOM via the browser tool and from the static build output, both of which capture it correctly.

---

## Executive summary

Technically this is a **well-built site** — genuinely above the norm for the category. No duplicate metadata, no orphan pages, no broken internal links, complete CLS protection, fast server, correct security headers. The fundamentals someone usually has to fix are already right.

Two things are undermining it, one of them severe:

1. **A site-wide canonical pointing at a domain with no DNS record.** Live right now, on all 19 pages. This is a hard indexation blocker and outranks everything else in this report.
2. **4.73 MB of eager-loaded PNG in the homepage hero.** Almost certainly failing LCP on mobile.

Both are fixable without touching content. Everything below P1 is refinement.

---

## P0 — Critical: canonical points to a non-resolving domain

**Issue.** Every page canonicalizes to `https://orlmedia.com/…`, which has **no DNS A record** (`curl: (6) Could not resolve host`). The site actually serves from `www.orlmedia.agency`.

**Impact: Critical.** A canonical is a directive, not a hint. You are instructing Google that the authoritative version of every page lives at a host that does not exist. This suppresses indexing of the URLs that *do* exist, and it is live today:

```
/                       -> rel="canonical" href="https://orlmedia.com/"
/about/                 -> rel="canonical" href="https://orlmedia.com/about/"
/engine/pricing/        -> rel="canonical" href="https://orlmedia.com/engine/pricing/"
/blog/buying-windows/   -> rel="canonical" href="https://orlmedia.com/blog/buying-windows/"
```

Same dead host in `og:url`, `og:image`, every JSON-LD `@id`, all 19 sitemap `<loc>` entries, and the `robots.txt` Sitemap directive.

**Fix.** Already written and verified in source (`astro.config.mjs` + `src/lib/schema.ts` + `public/robots.txt`), rebuilt and confirmed at zero remaining references. **It is not deployed.** Deploying is the single highest-value SEO action available.

**Priority: 1.** Nothing else in this report compounds until this ships.

---

## P1 — High impact

### 1. Homepage hero ships 4.73 MB of uncompressed PNG

**Issue.** Two hero images, both `loading="eager"`, served at full size:

| Asset | Size | Dimensions | Format |
|---|---|---|---|
| `/3.png` | **2.42 MB** | 1254×1254 | PNG |
| `/rob.png` | **2.31 MB** | 1024×1536 | PNG |

Measured live — they transfer at full weight (PNG gains nothing from Brotli). For contrast, the HTML is 148 KB → **32.6 KB** compressed, and existing WebP assets on the same site are 0.10–0.28 MB.

**Impact: High.** These are photographic images in lossless format, eager-loaded, above the fold. This is the LCP element on the homepage. On a mobile connection this is the difference between passing and failing Core Web Vitals.

**Evidence.** The site *already* uses WebP correctly elsewhere (`p1.webp` 138 KB, `p3.webp` 0.28 MB, `bg-tile.webp`, `logos/*.webp`). The convention and tooling exist — these two files just never went through it.

**Fix.** Convert both to WebP (or AVIF) at equivalent visual quality. Based on the existing WebP assets, expect **~85–90% reduction** — roughly 4.73 MB → ~500 KB. Serve with `<picture>` and a PNG fallback if needed. Keep `loading="eager"` on the true LCP image only; the second hero slide can be lazy since it is off-screen at load.

**Priority: 2.**

### 2. 15 of 19 meta descriptions are truncated

**Issue.** 15 pages exceed the ~160-character SERP limit; the longest is 232 characters. Two are under 150.

| Page | Length |
|---|---|
| `/blog/buying-windows/` | 232 |
| `/engine/` | 220 |
| `/blog/ai-search-invisible/` | 216 |
| `/audit/` | 207 |
| `/blog/lean-by-design/` | 198 |
| …10 more over 160 | |
| `/results/` | 127 (short) |
| `/blog/` | 129 (short) |

**Impact: Medium-High.** Doesn't affect ranking directly, but truncation cuts the CTA off mid-sentence and depresses CTR — which does feed ranking.

**Fix.** Rewrite to 150–160 characters with the value proposition front-loaded. `/results/` and `/blog/` have unused headroom.

**Priority: 3.**

### 3. Title tags: 7 truncated, 8 under-used

**Issue.** 7 titles exceed 60 characters and truncate in the SERP; 8 fall under 50 and waste available space.

Worst truncations:
- `/blog/share-of-answer/` — 79 chars
- `/blog/cac-payback-18-months/` — 75
- `/blog/lean-by-design/` — 72
- `/blog/ai-native-competitors/` — 71

Most under-used:
- **`/` — 36 chars** ("ORL Media — Inside the Growth Engine")
- `/book/` — 23
- `/engine/proof/` — 41
- `/engine/signals/` — 42

**Impact: Medium.** The homepage is the highest-value title on the site and is using 36 of ~60 characters, with no category keyword. Nothing in it says *what ORL does* or names the category a buyer would search.

**Fix.** Target 50–60 characters. For the homepage, work the category in — e.g. "ORL Media — Growth Infrastructure for B2B SaaS & AI" (51). Shorten blog titles for the `<title>` while keeping the full headline as the on-page H1; they don't have to match.

**Priority: 3.**

### 4. Two H1s on `/engine/visibility/`

**Issue.** The page renders two H1 elements:

```
H1 #1: "Visibility."
H1 #2: "Visibility — Get discovered. Buyers now ask AI before they ever search your name…"
```

**Impact: Medium.** Ambiguous primary topic signal. This is the bespoke page (`visibility.astro`), so it diverged from the shared `[module].astro` template where the other three are correct.

**Fix.** Demote one to H2 — keep the descriptive one as H1 since it carries the keyword, or keep "Visibility." as H1 and make the other a lead paragraph. One H1 per page.

**Priority: 3.**

---

## P2 — Medium / quick wins

### 5. Two-hop redirect chain from HTTP apex

```
http://orlmedia.agency/  → 308 → https://orlmedia.agency/  → 308 → https://www.orlmedia.agency/
```

**Impact: Low-Medium.** Two hops dilutes link equity slightly and adds latency. `http://www.` and `https://` apex both resolve in one hop; only the HTTP apex chains.

**Fix.** Add a direct `http://orlmedia.agency/*` → `https://www.orlmedia.agency/*` rule so it is a single 308.

**Priority: 4.**

### 6. Heading level skip on `/results/`

An H2 is followed directly by an H4. **Fix:** promote to H3. **Priority: 5.**

### 7. Blog posts thinly linked internally

| Post | Inbound internal links |
|---|---|
| `/blog/lean-by-design/` | 1 |
| `/blog/ai-native-competitors/` | 1 |
| `/blog/churn-signals/` | 2 |
| `/blog/cac-payback-18-months/` | 2 |
| `/blog/share-of-answer/` | 2 |

Only the 3 `featured: true` posts get surfaced on the homepage; the rest are reachable only via `/blog/`.

**Impact: Medium.** These posts contain the site's best topical depth and its statistics, but receive almost no internal authority.

**Fix.** Add contextual cross-links between related posts (churn-signals ↔ ai-churn-wave, cac-payback ↔ buying-windows, share-of-answer ↔ ai-search-invisible), and link from the relevant `/engine/*` page to its supporting article.

**Priority: 4.**

---

## What is already right — do not change

These are genuinely good and worth protecting:

- **Metadata hygiene** — 19/19 pages have unique, present titles and descriptions. Zero duplicates, zero missing. Rare.
- **Internal link graph** — zero orphan pages, zero broken internal links, every page reachable within 2 clicks. `/`, `/blog/`, `/book/`, `/engine/` each carry 19 inbound links.
- **CLS protection** — **22/22 images carry explicit `width` and `height`.** Almost nobody does this completely.
- **Alt text** — 0 images missing the `alt` attribute. 17 are intentionally `alt=""` (decorative); the 5 meaningful ones (AI engine logos) are properly described.
- **Server performance** — TTFB **229–259 ms** across three runs. Brotli *and* gzip negotiated. Vercel CDN with cache HITs.
- **Security** — HTTPS everywhere, HSTS `max-age=63072000` (2 years), no mixed content.
- **Correct 404s** — real 404 status, not a soft 200.
- **Mobile** — `viewport` meta on 19/19, `lang="en"` on 19/19, responsive (no separate m. site).
- **Rendering** — fully server-rendered static HTML. No JS-dependency for content or metadata.
- **Structured data** — `Organization`, `WebSite`, `Article`, `Service`, `BreadcrumbList`, `FAQPage` in a correct `@graph`, verified in the rendered DOM.

---

## What I could not verify

Stated plainly rather than guessed:

- **Actual index coverage.** No Search Console access, and scripted `site:` queries are unreliable. I cannot say how many pages Google has indexed, or whether the dead canonical has already caused deindexing. **This is the first thing to check once you deploy the fix.**
- **Field Core Web Vitals.** I measured asset weight and TTFB, which strongly imply an LCP problem, but real LCP/INP/CLS need CrUX or GSC field data.
- **Backlink profile and authority.** Requires Ahrefs/Semrush.
- **Keyword rankings, traffic baseline, competitors.** No analytics access; you did not specify target keywords or competitors.

---

## Prioritized action plan

### Critical — this week
1. **Deploy the canonical fix.** Already built and verified. Everything else is downstream.
2. Submit the corrected `sitemap-index.xml` in Search Console; request indexing for the homepage.
3. Check GSC Coverage for pages excluded via "Alternate page with proper canonical tag" — that is what the dead canonical would have produced.

### High impact — next
4. Convert `rob.png` and `3.png` to WebP/AVIF (~4.73 MB → ~500 KB).
5. Set `loading="lazy"` on the off-screen second hero image.
6. Rewrite 15 meta descriptions to 150–160 chars.
7. Rewrite the homepage title to use its full 60 characters with the category in it.
8. Fix the duplicate H1 on `/engine/visibility/`.

### Quick wins
9. Collapse the HTTP-apex redirect chain to one hop.
10. Fix the H2→H4 skip on `/results/`.
11. Add contextual internal links between related blog posts.

### Ongoing
12. Establish a traffic/ranking baseline in GSC once indexing recovers.
13. Add source citations to published statistics (see `CITATIONS-TODO.md`) — E-E-A-T, and the top-ranked factor for AI search.
14. Give articles a named `Person` author with credentials (currently the Organization).

---

## Scoring

| Dimension | Score | Note |
|---|---|---|
| Crawlability | 9/10 | Open robots, clean sitemap, no traps |
| **Indexation** | **1/10** | **Canonical to non-resolving domain, site-wide** |
| Site speed (server) | 9/10 | TTFB ~230 ms, Brotli, CDN |
| Site speed (assets) | 3/10 | 4.73 MB of eager PNG |
| Mobile | 9/10 | Responsive, viewport, lang all correct |
| Security | 10/10 | HTTPS, HSTS 2yr, clean redirects |
| Titles | 5/10 | Unique, but 15/19 mis-sized |
| Meta descriptions | 4/10 | Unique, but 15/19 truncated |
| Heading structure | 7/10 | One duplicate H1, one level skip |
| Internal linking | 8/10 | No orphans; blog under-linked |
| Images | 6/10 | Perfect alt + dimensions, terrible weight |
| Structured data | 9/10 | Comprehensive, valid `@graph` |
| Content quality | 8/10 | Deep, original, current — needs citations |

**Overall: 6.8/10** — held down almost entirely by two fixable defects. With the canonical deployed and the hero images converted, this site is realistically 8.5+/10 without writing a single new page.
