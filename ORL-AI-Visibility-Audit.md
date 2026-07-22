# AI Visibility Audit — orlmedia.agency

**Audited:** https://www.orlmedia.agency/ · **Date:** 2026-07-22
**Method:** Raw HTML retrieval (not rendered preview), DNS resolution, live AI-bot user-agent simulation, JSON-LD parsing across 5 templates.
**Scope note:** All findings below are properties of the **orlmedia.agency** deployment. Where `orlmedia.com` appears, it is because the `.agency` site emits that string in its own markup.

---

## Verdict

The site is **structurally excellent and technically invisible.**

Content quality, server-side rendering, and schema depth are genuinely above the B2B agency baseline — this is the hard part, and it is already done. But every canonical identity signal on the site points to `orlmedia.com`, **a domain with no DNS A record.** AI engines and Google are being told, on all 19 pages, that the authoritative version of this content lives at a host that does not exist.

Until that is fixed, the other 90% of AEO work cannot compound. Fix P0 first; everything else is downstream.

---

## Identity mismatch (P0 — blocker)

Three different hosts are in play:

| Layer | Value | Status |
|---|---|---|
| Actual serving host | `www.orlmedia.agency` | ✅ 200 (apex 308s → www) |
| Declared canonical / `og:url` / JSON-LD `@id` | `orlmedia.com` | ❌ **No DNS A record** |
| `robots.txt` Sitemap directive | `orlmedia.com/sitemap-index.xml` | ❌ Dead |

**Verification:** `curl: (6) Could not resolve host: orlmedia.com`. `nslookup` returns a name with no address. `.agency` resolves to `216.198.79.1` (Vercel).

**Every affected surface:**

- `<link rel="canonical">` → `https://orlmedia.com/…` on all pages tested (home, about, results, engine/pricing, blog/buying-windows)
- `og:url`, `og:image`, `twitter:image` → dead domain (social + AI preview cards render nothing)
- JSON-LD `@id` on `Organization`, `WebSite`, `Article.author`, `Article.publisher`, `BreadcrumbList` → dead domain
- `sitemap-index.xml` → points to `orlmedia.com/sitemap-0.xml`
- All **19** `<loc>` entries in the sitemap → dead domain
- `robots.txt` Sitemap directive → dead domain
- Count in homepage HTML: **9 references to `orlmedia.com`, 0 to `orlmedia.agency`**

**Why this is severe for AEO specifically:** a canonical tag is a directive, not a hint. You are instructing every crawler to attribute this content to a host that returns nothing. The entity graph — the thing AI engines use to know "ORL Media" is a real, resolvable organization — is anchored to a void. Retrieval can still happen; **attribution cannot.**

### The one decision you need to make

| If… | Do this |
|---|---|
| **You own `orlmedia.com` and want it** (stronger brand domain) | Point DNS at Vercel, add it as the primary domain, 301 `.agency` → `.com`. Leave all markup as-is — it becomes correct automatically. |
| **You don't own it / aren't using it** | Rewrite every occurrence to `https://www.orlmedia.agency` — canonical, OG, JSON-LD `@id`, sitemap, robots.txt. Likely a single site-config constant. |

Do **not** leave it in the current split state. Either resolution is fine; the mismatch is what's fatal.

---

## What's already right (don't touch)

These are real strengths and unusually good for the category:

- **Fully server-rendered.** 3,397 visible words on the homepage and 8,207 on a blog post are present in raw HTML with no JS execution. AI crawlers see everything. This is the most common AEO failure and you don't have it.
- **All AI bots verified live at 200** — I fetched with real user-agent strings: `GPTBot` 200, `PerplexityBot` 200, `ClaudeBot` 200. `robots.txt` is `Allow: /` with an on-brand comment.
- **No `noindex`, no blocking `X-Robots-Tag`.**
- **Schema graph, not scattered blobs** — correct `@graph` pattern with `Organization` + `WebSite` + `Article` + `Service` + `BreadcrumbList`.
- **`Article` carries `datePublished`, `dateModified`, `wordCount`, `articleSection`** — freshness signals AI engines weight heavily.
- **Content is fresh** (2026-07-19) and **long-form** (7,926 words). Definitive guides are ~15% of AI citations; you're producing the right format.
- **`knowsAbout` entity hints present** — GTM infrastructure, AEO, intent data, buying-window intelligence.
- **41 headings, strong hierarchy**, many phrased as buyer-language questions ("Buyers now ask ChatGPT — are you in the answer?") — good query-pattern matching.

---

## Prioritized findings

### P0 — Blocker
**1. Canonical identity points to a non-resolving domain.** See above. Nothing else compounds until this is fixed.

### P1 — High leverage

**2. Zero citation links site-wide.** The only external `href`s across all 5 pages are font CDNs (Google Fonts, Fontshare). Total distinct outbound citations: **0**.

This is the single highest-ranked GEO factor — the Princeton/KDD 2024 study puts *cite sources* at **+40% visibility**, the top of nine methods. You are publishing strong statistics with no attribution:

| Stat published | Source shown |
|---|---|
| "75% of B2B software companies changed pricing or packaging in the past twelve months" | none |
| "Hybrid pricing jumped from 25% to 37%" | none |
| "AI credits growing 126% annually" | none |
| "114% net revenue per account" | none |

There is a credibility dimension beyond the ranking factor: you sell evidence-graded AEO, and you maintain `ORL_AEO_v1.1_Evidence_Hygiene_Log.md`. Applying that standard to your own site is both the fix and the proof.

**3. No `FAQPage` schema anywhere** — and no FAQ blocks at all. This is the highest-ROI schema for ChatGPT/Perplexity because it maps directly to natural-language Q&A extraction. You already write in question-shaped headings; converting a handful per page into a marked-up FAQ is mostly formatting, not new writing.

**4. `Article.author` is the Organization, not a Person.** No named author, no credentials, no bio anywhere. Expert attribution is a **+25–30%** factor and a core E-E-A-T signal. For an agency selling expertise, an unattributed 7,926-word article underuses its own authority.

**5. Organization entity is thin.** Present: `name`, `url`, `description`, `slogan`, `knowsAbout`. **Missing: `sameAs`, `logo`, `foundingDate`, `address`, `contactPoint`, `founder`.**

`sameAs` is the important one — it's how engines reconcile "ORL Media" with LinkedIn, Crunchbase, X, and G2 profiles into one entity. Without it, there is nothing tying your site to your off-site presence.

### P2 — Agent-readiness

**6. `/llms.txt` → 404. `/pricing.md` → 404.** Not required by Google, but ChatGPT/Claude/Perplexity and autonomous buying agents do parse them. Low effort, direct upside.

**7. Pricing page shows no prices.** `/engine/pricing/` is 543 words with **zero currency figures** — it's "In build — waitlist open," and the page is about pricing-as-a-service rather than your own cost. AI agents comparing vendors filter out unparseable pricing and recommend competitors they can read. Even a range or a "starts at" anchor changes this.

---

## What I could not verify

I want to be straight about the limits of this audit rather than pad it:

- **I did not run live queries against ChatGPT, Perplexity, or Google AI Overviews.** Those require interactive sessions I can't drive at scale here. So I have **no data on whether you are currently cited**, and I won't invent any.
- **Competitor citation gap analysis is therefore unstarted.** Naming competitors and asserting they out-cite you would be fabrication.

Both are genuinely important, and both are mechanical once someone runs them. The ready-to-execute matrix is below.

### Citation baseline matrix — run this before any content work

Run each query in ChatGPT (search on), Perplexity, and Google. Record cited/not and which domains won.

| # | Query | AIO | ChatGPT | Perplexity | ORL cited? | Who was |
|---|---|---|---|---|---|---|
| 1 | What is answer engine optimization? | | | | | |
| 2 | How do B2B SaaS companies get cited by ChatGPT? | | | | | |
| 3 | Best AEO / GEO agencies for B2B SaaS | | | | | |
| 4 | What are buying windows in B2B GTM? | | | | | |
| 5 | How to measure share of answer | | | | | |
| 6 | Growth infrastructure vs marketing agency | | | | | |
| 7 | Why does my SaaS rank #1 but get no clicks? | | | | | |
| 8 | B2B SaaS intent data providers | | | | | |
| 9 | How to track AI search visibility | | | | | |
| 10 | ORL Media | | | | | |

Query 10 is the entity test — if AI engines can't describe ORL Media correctly, that's the P0 canonical damage showing up in the wild.

---

## Roadmap

### Week 1 — Unblock (nothing else matters first)
1. Resolve the domain decision (`.com` vs `.agency`).
2. Propagate to: canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD `@id` ×5, `sitemap-index.xml`, all 19 sitemap `<loc>`s, `robots.txt` Sitemap.
3. Verify: `curl -sL <domain> | grep canonical` returns a host that resolves.
4. Submit the corrected sitemap in Search Console.
5. Run the 10-query baseline matrix above and log it.

### Week 2 — Authority
6. Add source links to every published statistic (start with `/engine/pricing/` and the blog). Apply your own evidence-hygiene standard.
7. Add `sameAs`, `logo`, `foundingDate`, `contactPoint` to `Organization`.
8. Convert `Article.author` to a `Person` with real name, title, and credentials; add author bios.

### Week 3 — Extractability
9. Add `FAQPage` schema to homepage, `/audit/`, and the four `/engine/*` pages — 4–6 Q&As each, drawn from existing question-headings.
10. Add 40–60 word direct-answer blocks under the top H2 of each engine page.
11. Ship `/llms.txt` and `/pricing.md`.

### Week 4 — Presence (the 6.5x multiplier)
12. Off-site is where citations actually come from — brands are cited ~6.5x more via third-party sources than their own domain. Prioritize: LinkedIn company page, Crunchbase, G2/Clutch profiles, then authentic participation in relevant communities.
13. Re-run the query matrix; diff against the Week 1 baseline.

---

## Scoring

| Dimension | Score | Note |
|---|---|---|
| Crawlability | 9/10 | Open robots.txt, clean 308 → www |
| AI bot access | 10/10 | GPTBot / PerplexityBot / ClaudeBot all verified 200 |
| Rendering / extractability | 9/10 | Fully server-rendered, excellent |
| Structured data | 6/10 | Good graph, but anchored to dead domain; no FAQ |
| Content depth & freshness | 8/10 | Long-form, current, well-structured |
| **Canonical integrity** | **0/10** | **Dead domain site-wide** |
| Citations / sourcing | 1/10 | Zero outbound citations |
| Entity strength | 3/10 | No `sameAs`, no Person author |
| Agent readiness | 2/10 | No llms.txt, no pricing.md, no visible pricing |

**Overall: 5.3/10** — with the unusual profile that the expensive foundations are built and the cheap fixes are missing. Post-P0 and P1, this realistically reaches 8+/10 without writing a single new page.
