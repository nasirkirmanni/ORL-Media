# Citation TODO — every unsourced statistic on the site

Generated from `src/content/blog/*.md` and `src/lib/modules.ts` (which supplies `/engine/*`).

**No sources have been invented.** Every `url` below is `null` in `src/lib/citations.ts` and will stay that way until you supply the real one.

## How to hand these back

Reply with `id → URL` lines, e.g.:

```
cold-email-reply-1-2 → https://example.com/report-2026
no-decision-89 → https://example.com/study
```

I drop them into `CITATIONS` in [src/lib/citations.ts](src/lib/citations.ts) and place `<Cite id="..." />` at each occurrence listed below. One URL per claim covers every occurrence.

Partial batches are fine — `cite()` renders a link only for ids that have a url, so cited and uncited claims can coexist.

---

| # | id | claim as published | occurrences (file:line) | source URL |
|---|----|--------------------|--------------------------|------------|
| 1 | `ai-chatbot-eval-71` | 71% of B2B buyers use AI chatbots during software evaluation | `ai-search-invisible.md:19`, `buying-windows.md:131`, `cac-payback-18-months.md:25`, `modules.ts:86`, `share-of-answer.md:11` | `TODO` |
| 2 | `search-start-57` | 57% of decision-makers start with web search | `ai-search-invisible.md:20`, `buying-windows.md:131`, `cac-payback-18-months.md:25`, `modules.ts:87` | `TODO` |
| 3 | `ai-purchase-process-94` | 94% of B2B buyers now use generative AI during their purchase process | `ai-search-invisible.md:18`, `ai-search-invisible.md:3` | `TODO` |
| 4 | `aio-ctr-8-vs-15` | organic CTR 8% with an AI Overview vs 15% without | `modules.ts:90` | `TODO` |
| 5 | `zero-click-60` | ~60% of Google searches end with no click | `ai-churn-wave.md:44`, `churn-signals.md:43`, `modules.ts:91` | `TODO` |
| 6 | `use-case-match-53-vs-7` | 53% vs 7% — buyers notice use-case match over brand recognition in AI answers | `modules.ts:92` | `TODO` |
| 7 | `cold-email-reply-1-2` | 1.2% cold email response rate in 2026 | `buying-windows.md:17`, `buying-windows.md:182`, `buying-windows.md:198`, `buying-windows.md:285`, `buying-windows.md:3` +7 more | `TODO` |
| 8 | `not-in-market-95` | 95% of your ICP is not in-market at any given moment (roughly 5% is) | `ai-churn-wave.md:16`, `buying-windows.md:175`, `buying-windows.md:21`, `buying-windows.md:23`, `buying-windows.md:232` +5 more | `TODO` |
| 9 | `day-one-shortlist-95` | 95% of winning vendors were on the buyer’s day-one shortlist | `modules.ts:168` | `TODO` |
| 10 | `no-decision-89` | 89% of sellers report deals stalling into no-decision | `modules.ts:204`, `modules.ts:238` | `TODO` |
| 11 | `win-rate-29-to-19` | win rates fell from 29% to 19% in a single year | `modules.ts:204`, `modules.ts:239` | `TODO` |
| 12 | `reviews-consulted-74` | 74% of buyers consult customer reviews | `modules.ts:208`, `modules.ts:240` | `TODO` |
| 13 | `committee-13-stakeholders` | a median of 13 stakeholders sit in the buying committee | **no match — verify** | `TODO` |
| 14 | `security-questionnaires-9wk` | buyers spend 9 weeks/yr on vendor security questionnaires | **no match — verify** | `TODO` |
| 15 | `repricing-75` | 75% of B2B software companies changed pricing or packaging in the past twelve months | `modules.ts:280`, `modules.ts:300`, `modules.ts:314`, `modules.ts:327` | `TODO` |
| 16 | `hybrid-pricing-25-to-37` | hybrid pricing jumped from 25% to 37% of companies in a year | `modules.ts:280`, `modules.ts:316`, `modules.ts:318` | `TODO` |
| 17 | `ai-credits-126` | AI credits are growing 126% annually | `modules.ts:284`, `modules.ts:316`, `modules.ts:320` | `TODO` |
| 18 | `expansion-cac-half` | expansion revenue costs roughly half what a new logo does | **no match — verify** | `TODO` |
| 19 | `nrr-median-98` | median net revenue retention of ~98% for $1–10M ARR SaaS | `ai-churn-wave.md:14`, `ai-churn-wave.md:3`, `ai-churn-wave.md:34`, `ai-churn-wave.md:50`, `cac-payback-18-months.md:14` | `TODO` |
| 20 | `nrr-ai-under-50-is-32` | AI products under $50/month: 32% NRR | `ai-churn-wave.md:20`, `ai-churn-wave.md:3` | `TODO` |
| 21 | `nrr-b2b-comparable-82` | typical B2B SaaS at similar price points: ~82% NRR | `ai-churn-wave.md:21` | `TODO` |
| 22 | `nrr-ai-over-250-is-85` | AI products above $250/month average only ~85% NRR | `ai-churn-wave.md:22` | `TODO` |
| 23 | `usage-decline-40-predicts-churn` | a 40% decline in weekly active usage is the single most reliable early indicator | `ai-churn-wave.md:40` | `TODO` |
| 24 | `cac-payback-12-15-to-18` | CAC payback moved from 12–15 months (2023) to 18 months | `buying-windows.md:153`, `buying-windows.md:166`, `buying-windows.md:17`, `cac-payback-18-months.md:10` | `TODO` |
| 25 | `paid-share-34-to-26` | paid acquisition’s share of pipeline: 34% in 2023 → 26% in 2026 | `buying-windows.md:17`, `buying-windows.md:591`, `buying-windows.md:77`, `cac-payback-18-months.md:22`, `cac-payback-18-months.md:3` | `TODO` |
| 26 | `organic-share-22-to-27` | organic and content-led channels: 22% → 27% of pipeline | `buying-windows.md:139`, `buying-windows.md:17`, `cac-payback-18-months.md:23` | `TODO` |
| 27 | `rev-per-employee-100k` | median revenue per employee at $1–3M ARR is now ~$100K | `ai-churn-wave.md:34`, `lean-by-design.md:13`, `lean-by-design.md:2`, `lean-by-design.md:3`, `lean-by-design.md:30` | `TODO` |
| 28 | `cmo-tenure-under-2yr` | CMO tenure averages under two years | `lean-by-design.md:3` | `TODO` |
| 29 | `ai-native-4-4m-per-head` | AI-native startups running at $4.4M revenue per head | `ai-native-competitors.md:16`, `ai-native-competitors.md:2` | `TODO` |
