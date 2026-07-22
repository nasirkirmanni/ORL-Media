/* ─────────────────────────────────────────────────────────────
   THE FOUR SYSTEMS — single source of truth.

   Lives here rather than inside a page because three consumers need
   it and they must not drift:
     • engine/[module].astro   — renders signals, proof, pricing
     • engine/visibility.astro — the bespoke fork (system 01)
     • both of the above       — the system strip and the "next
                                 system" footer link, which need
                                 ALL FOUR records regardless of
                                 which page is rendering.

   Systems language throughout: install, run, own — never "offer".
   ───────────────────────────────────────────────────────────── */

export type Step = { t: string; d: string };
export type Stat = { n: string; l: string };

export type Module = {
  num: string; name: string; accent: string; accentDark: string; accentText: string;
  pos: string; sub: string;
  /* SERP <title>, kept at 50-60 chars with the category keyword in it.
     The old template ('Name — Pos | ORL Growth Engine') ran 40-47 chars
     and named no keyword a buyer would actually search. */
  seoTitle: string;
  /* SERP meta description, 150-160 chars. The old template
     ('System N of the ORL Growth Engine. ' + sub) ran 168-187 and
     truncated mid-sentence, burning the CTA. */
  seoDescription: string;
  /* 40–60 words, rendered directly under the page's top H2 and written
     to survive being lifted out of the page alone. Answer engines extract
     passages, not pages — this is the passage. Every claim in it must
     already appear elsewhere on the same page. */
  answer: string;
  /* Rendered visibly AND serialized to FAQPage JSON-LD from this one
     array, so the marked-up Q&A can never drift from what a visitor
     reads. Answers are drawn from existing page copy only. */
  faq: { q: string; a: string }[];
  status: { label: string; tone: 'live' | 'limited' | 'partner' | 'build' };
  metric: { label: string; from: number; to: number; fmt: string; def: string };
  problem: { headline: string; stat: string; statLine: string; body: string; support: Stat[] };
  steps: Step[];
  keeps: string[];
  deliver: string[];
  cta: { h: string; s: string; btn: string; note: string };
};

/* Render order. Drives the system strip and the wrap-around "next system"
   link (pricing → visibility), so it keeps all four even though
   [module].astro no longer generates visibility. */
export const ORDER = ['visibility', 'signals', 'proof', 'pricing'] as const;
export type ModuleSlug = (typeof ORDER)[number];

export const MODULES: Record<string, Module> = {
  visibility: {
    num: '01', name: 'Visibility', accent: '#8a5320', accentDark: '#c49a5e', accentText: '#8a5320',
    pos: 'Get discovered.',
    seoTitle: 'AI Search Visibility & Answer Engine Optimization | ORL',
    seoDescription:
      'Buyers ask AI before they search your name. ORL Visibility maps your category’s buying questions, engineers the answers, and tracks Share of Answer monthly.',
    sub: 'Buyers now ask AI before they ever search your name. Visibility is the system that puts you inside the answer — and keeps you there.',
    answer:
      'ORL Visibility is an answer engine optimization system for B2B SaaS. It maps the 100+ real buying questions asked in your category, scores how four AI engines answer each one today, then engineers the content, entity and citation layers that get you cited. Progress is tracked monthly as Share of Answer against three competitors.',
    faq: [
      {
        q: 'What is answer engine optimization (AEO)?',
        a: 'SEO helps you rank in search. AEO helps you become the answer. Buyers now ask ChatGPT, Gemini, Claude and AI-powered search engines for recommendations, comparisons and solutions — AEO is the work of being present, and cited, inside those answers rather than ranked below them.',
      },
      {
        q: 'What is Share of Answer?',
        a: 'Of the real buying questions asked in your category, Share of Answer is the percentage of AI answers that cite or recommend you. One number, tracked monthly, benchmarked against your three closest competitors. It is the single metric the Visibility system is accountable to.',
      },
      {
        q: 'Why aren’t AI engines recommending us?',
        a: 'Usually one of four causes: not enough authoritative mentions connecting your brand to the category; competitors appearing more often across the sources AI systems rely on; positioning that does not make clear when or why to recommend you; or missing coverage of the questions buyers ask before deciding.',
      },
      {
        q: 'How does Visibility actually work?',
        a: 'Four steps. Map the 100+ buying questions in your category and score how AI answers them today. Engineer the answers through content, entity optimization and structured data. Build the third-party citation surface AI engines verify against. Then re-score every question monthly and reprioritize.',
      },
      {
        q: 'Why can’t we just buy ads inside AI answers?',
        a: 'There is no ad unit inside a ChatGPT answer — presence there is earned or it is absent. When an AI Overview appears, organic click-through roughly halves, and most searches now end without a click at all. The buyers researching your category are getting an answer either way.',
      },
      {
        q: 'What do we keep if the engagement ends?',
        a: 'The question map and every answer asset built on it, the structured-data and entity layer installed on your domain, the citation network of reviews, research and references, and the Share of Answer dashboard with its full history. All of it stays yours and keeps running.',
      },
    ],
    status: { label: 'Live', tone: 'live' },
    metric: {
      label: 'Share of Answer', from: 38, to: 71, fmt: '%',
      def: 'Of the real buying questions asked in your category, the percentage of AI answers that cite or recommend you. One number. Tracked monthly. Benchmarked against your three closest competitors.',
    },
    problem: {
      headline: 'The search result is no longer the destination.',
      stat: '71%',
      statLine: 'of B2B buyers use AI chatbots during software evaluation. 57% start with search.',
      body: 'When an AI Overview appears, organic click-through roughly halves. Most searches now end without a click at all. And there is no ad unit inside a ChatGPT answer — presence there is earned or it is absent. The buyers researching your category are getting an answer. The only question is whether you are in it.',
      support: [
        { n: '8% vs 15%', l: 'organic CTR with vs without an AI Overview' },
        { n: '~60%', l: 'of Google searches end with no click' },
        { n: '53% vs 7%', l: 'buyers notice use-case match over brand recognition in AI answers' },
      ],
    },
    steps: [
      { t: 'Map the questions', d: 'We identify the 100+ real buying questions asked in your category — problem, comparison, alternative, and pricing intent — and score how four AI engines answer every one of them today.' },
      { t: 'Engineer the answers', d: 'Content restructured around decisions, not keywords. Entity optimization, comparison pages, structured data — the machine-readable layer AI systems need to cite you with confidence.' },
      { t: 'Build the citations', d: 'AI engines trust what other sources verify: review platforms, original research, cited experts. We build the third-party surface that makes recommending you the statistically safe answer.' },
      { t: 'Track Share of Answer', d: 'Monthly re-scoring across every mapped question. What moved, what slipped, which competitor gained — and where next month’s work goes. The loop never closes.' },
    ],
    keeps: [
      'The question map and every answer asset built on it',
      'The structured-data and entity layer on your domain',
      'The citation network — reviews, research, references',
      'The Share of Answer dashboard and its history',
    ],
    deliver: [
      '100+ question category map, scored quarterly',
      'Share of Answer dashboard vs 3 competitors',
      'Entity + schema layer installed on your site',
      'Decision-stage content system (comparison, alternatives, pricing)',
      'Citation and review-surface program',
      'Monthly trend report with next-month priorities',
    ],
    cta: {
      h: 'Every engagement starts with the Audit.',
      s: 'Fixed scope. 10 business days. You see exactly what buyers see across four AI engines — and exactly what to fix first. If you score well, we’ll tell you the truth.',
      btn: 'Start with the AI Visibility Audit',
      note: 'Fixed scope · 10 business days · no retainer required',
    },
  },

  signals: {
    num: '02', name: 'Signals', accent: '#c98b32', accentDark: '#d9a45c', accentText: '#9a6417',
    pos: 'Find demand.',
    seoTitle: 'Buying-Window Intelligence & Intent Signals | ORL Media',
    seoDescription:
      'Roughly 5% of your market is in a buying window right now. ORL Signals reads signal convergence to flag those accounts before they ever raise a hand.',
    sub: 'At any moment, roughly 5% of your market is in a buying window. Signals is the system that tells you which 5% — before they raise a hand.',
    answer:
      'ORL Signals is a buying-window detection system for B2B SaaS. Roughly 5% of your market is in-market at any moment, and cold email replies at 1.2% because the other 95% is not buying. Signals reads convergence — funding, RevOps hiring, stack migration, competitor churn together — and flags those accounts before they raise a hand.',
    faq: [
      {
        q: 'What is a buying window?',
        a: 'A period when an account is actually building the apparatus to buy. Companies rarely buy because of one event — a funding round means money, not need. But funding plus RevOps hiring plus a CRM migration plus competitor churn together describe a company preparing to purchase. Single signals are noise; convergence is evidence.',
      },
      {
        q: 'How do you know the trigger model works before we commit?',
        a: 'We work backward from your closed-won history — what was true at those accounts sixty days before the first call — then backtest the model against twelve months of your real deals. If it cannot find the deals you already won, it does not go live.',
      },
      {
        q: 'What signals do you monitor?',
        a: 'Job postings, stack changes, review-site activity, community questions, compliance triggers and competitor churn — signals that are hard to source and close to the decision, watched across your full ICP every week. A job posting typically precedes the hire, and the evaluation, by two to three months.',
      },
      {
        q: 'Is the scoring a black box?',
        a: 'No. Signals uses weighted scoring with time decay and combinatorial logic, transparent enough that your reps can sanity-check every flag. Every score arrives with its evidence trail attached, and when a window opens a human approves every send before it goes out.',
      },
      {
        q: 'Why is Signals capped at five clients?',
        a: 'Signal quality degrades with scale, so we do not scale it. Signals runs at a hard cap of five concurrent clients. When a seat opens, waitlist clients get the backtest first — we prove the model on your own closed-won deals before you commit to anything.',
      },
      {
        q: 'What do we keep if the engagement ends?',
        a: 'The trigger model, trained on your wins and losses rather than generic intent, plus the signal data spine and account history, the deliverability infrastructure and warmed sending domains, and the playbook library tuned by outcome. Everything installed stays yours and keeps running.',
      },
    ],
    status: { label: 'Limited seats', tone: 'limited' },
    metric: {
      label: 'Qualified meetings booked', from: 0, to: 24, fmt: '',
      def: 'Meetings with accounts that were detected entering a buying window — not lists sprayed and prayed over. Volume goes down. Conversion goes up. That is the design.',
    },
    problem: {
      headline: 'You are not losing to competitors. You are losing to timing.',
      stat: '1.2%',
      statLine: 'cold email response rate in 2026 — because 95% of any market is not buying this quarter.',
      body: 'Companies rarely buy because of one event. A funding round means money, not need. But a funding round plus RevOps hiring plus a CRM migration plus competitor churn — together those describe a company building the apparatus to buy. Single signals are noise. Convergence is evidence. Signals is built to read convergence.',
      support: [
        { n: '95%', l: 'of your ICP is not in-market at any given moment' },
        { n: '2–3 mo', l: 'a job posting precedes the hire — and the evaluation' },
        { n: '95%', l: 'of winning vendors were on the buyer’s day-one shortlist' },
      ],
    },
    steps: [
      { t: 'Define the trigger hypothesis', d: 'We work backward from your closed-won history: what was true at those accounts sixty days before the first call? Then we backtest the model against twelve months of your real deals — if it can’t find the deals you already won, it doesn’t go live.' },
      { t: 'Monitor the market continuously', d: 'Job postings, stack changes, review-site activity, community questions, compliance triggers, competitor churn — the signals that are hard to source and close to the decision, watched across your full ICP, every week.' },
      { t: 'Score the convergence', d: 'Weighted signals, time decay, combinatorial scoring — transparent enough that your reps can sanity-check every flag. No black box. Every score arrives with its evidence trail attached.' },
      { t: 'Arm the outreach', d: 'When a window opens, AI drafts the "why this account, why now" from the actual evidence — and a human approves every send. Timing plus context is what survives the inbox filter nothing else does.' },
    ],
    keeps: [
      'The trigger model — trained on your wins and losses, not generic intent',
      'The signal data spine and account history',
      'Deliverability infrastructure and warmed sending domains',
      'The playbook library, tuned by outcome',
    ],
    deliver: [
      'Backtest report against 12 months of closed-won',
      'Live signal dashboard across your ICP',
      'Weekly approved-send queue with evidence trails',
      'Sending infrastructure + deliverability management',
      'Monthly conversion report — meetings, replies vs baseline',
      'Quarterly trigger-model recalibration',
    ],
    cta: {
      h: 'Five concurrent clients. That is the cap.',
      s: 'Signal quality degrades with scale, so we don’t scale it. When a seat opens, waitlist clients get the backtest first — we prove the model on your own closed-won deals before you commit to anything.',
      btn: 'Join the Signals waitlist',
      note: 'Capped at 5 clients · backtest before commitment',
    },
  },

  proof: {
    num: '03', name: 'Proof', accent: '#3e8e5a', accentDark: '#6fbb90', accentText: '#2f7d4c',
    pos: 'Win the deal.',
    seoTitle: 'Deal-Stage Proof: Unstick Stalled B2B Deals | ORL Media',
    seoDescription:
      '89% of B2B deals stall into no-decision. ORL Proof maps where yours die, builds the third-party evidence, and fires it into live deals at the stall moment.',
    sub: 'Your pipeline doesn’t die at the top of the funnel. It dies in security review, in committee, in "no decision." Proof is the system that arms the deal.',
    answer:
      'ORL Proof is a deal-stage evidence system for B2B SaaS. 89% of sellers report deals stalling into no-decision, and win rates fell from 29% to 19% in a single year. Proof maps where deals actually die, builds third-party evidence against those stall points, and fires it into live deals at the stall moment.',
    faq: [
      {
        q: 'Why doesn’t more marketing content fix stalled deals?',
        a: 'Vendor marketing collateral ranks dead last among the resources buyers consult, while 74% consult customer reviews. The least-trusted asset in the deal is the one you wrote about yourself. Evidence someone else can verify is the only thing that moves a stalled buyer.',
      },
      {
        q: 'What is a Stall Map?',
        a: 'Twelve months of closed-lost deals re-coded, stage durations benchmarked against won deals, and win/loss interviews with real buyers — including the no-decisions nobody calls back. The output is the three to five points where your revenue actually dies, with dollars attached to each.',
      },
      {
        q: 'How does evidence reach the buyer at the right moment?',
        a: 'CRM instrumentation flags stall conditions — a deal sitting in security review past the won-deal median, or a committee role never engaged — and queues the right asset with a drafted send. Evidence lands in the buyer’s hands at the stall moment, not in a folder.',
      },
      {
        q: 'Who has to be convinced in a B2B software deal?',
        a: 'A median of 13 stakeholders sit in the buying committee, and security review alone eats weeks — buyers spend roughly nine weeks a year on vendor security questionnaires. Proof builds one page per committee role, answering that role’s specific objection, plus a self-serve trust center.',
      },
      {
        q: 'How does an engagement start?',
        a: 'With the Stall Audit. We analyse twelve months of your closed-lost and no-decision deals, interview the buyers who went silent, and hand you the map of exactly where your revenue dies. It quantifies money you already lost, rather than money we might make you.',
      },
      {
        q: 'What do we keep if the engagement ends?',
        a: 'The Stall Map with revenue-at-risk quantified per stall point, the trust center and security response kit, the evidence library of case studies, evals and committee kits, and the review and reference programs — still running. All of it stays yours.',
      },
    ],
    status: { label: 'Design Partner — 3 seats', tone: 'partner' },
    metric: {
      label: 'No-decision rate', from: 31, to: 22, fmt: '%',
      def: 'The percentage of qualified opportunities that end in no decision at all — the number your CRO already tracks and nobody owns. Proof exists to own it.',
    },
    problem: {
      headline: 'The most expensive competitor is "no decision."',
      stat: '89%',
      statLine: 'of sellers report deals stalling into no-decision. Win rates fell from 29% to 19% in a single year.',
      body: 'Here is the uncomfortable data: vendor marketing collateral ranks dead last among the resources buyers consult. 74% consult customer reviews. A median 13 stakeholders sit in the committee, and security review alone eats weeks. More content is not the answer — the least-trusted asset in the deal is the one you wrote about yourself. Evidence someone else can verify is the only thing that moves a stalled buyer.',
      support: [
        { n: 'Dead last', l: 'where vendor collateral ranks among resources buyers trust' },
        { n: '13', l: 'stakeholders in the median buying committee' },
        { n: '9 weeks/yr', l: 'buyers spend on vendor security questionnaires' },
      ],
    },
    steps: [
      { t: 'Map the stall', d: 'Twelve months of closed-lost re-coded, stage durations benchmarked against won deals, and win/loss interviews with real buyers — including the no-decisions nobody ever calls back. Output: the three to five points where your revenue actually dies, with dollars attached.' },
      { t: 'Build the evidence', d: 'Trust center with published security posture. Questionnaire response kit. Case studies with named metrics a CFO can check. Published evals. One page per committee role, answering that role’s specific objection. Built strictly against the stall map — nothing else.' },
      { t: 'Fire into live deals', d: 'CRM instrumentation flags stall conditions — a deal sitting in security review past the won-deal median, a committee role never engaged — and queues the right asset with a drafted send. Evidence in the buyer’s hands at the stall moment, not in a folder.' },
      { t: 'Learn and retire', d: 'Every won and lost outcome returns to the library. Assets that appear in won deals get expanded. Assets nobody uses get retired. The objection matrix refreshes quarterly, because your competitors’ claims move.' },
    ],
    keeps: [
      'The Stall Map — where your deals die, quantified',
      'The trust center and security response kit',
      'The evidence library: case studies, evals, committee kits',
      'The review and reference programs, running',
    ],
    deliver: [
      'Stall Map with revenue-at-risk per stall point',
      'Self-serve trust center + questionnaire kit',
      'Quantified case-study engine',
      'Committee enablement kits — one per role',
      'Managed review + reference programs',
      'CRM proof-queue firing on stall triggers',
    ],
    cta: {
      h: 'It starts with the Stall Audit.',
      s: 'We analyse twelve months of your closed-lost and no-decision deals, interview the buyers who went silent, and hand you the map of exactly where your revenue dies. It quantifies money you already lost — which is a much easier conversation than money we might make you.',
      btn: 'Book the Stall Audit',
      note: 'Design partner program · 3 seats · audit credits toward month one',
    },
  },

  pricing: {
    num: '04', name: 'Pricing', accent: '#2b7f86', accentDark: '#64b4bb', accentText: '#1f6b72',
    pos: 'Monetize & expand.',
    seoTitle: 'SaaS Pricing, Packaging & Expansion Systems | ORL Media',
    seoDescription:
      '75% of B2B software companies repriced last year. ORL Pricing instruments consumption, tests packaging against real conversion, and triggers expansion.',
    sub: 'Winning the deal is half the revenue. Pricing is the system that turns packaging, usage, and expansion into the other half — the half at half the CAC.',
    answer:
      'ORL Pricing is a monetization and expansion system for B2B SaaS. 75% of B2B software companies changed pricing or packaging in the past twelve months, and hybrid pricing jumped from 25% to 37% in a year. Pricing instruments consumption, tests packaging against real buyer conversion, and fires expansion plays the week an account is ready.',
    faq: [
      {
        q: 'Why does usage-based pricing break traditional marketing?',
        a: 'If your product is usage- or credit-priced, the thing your marketing produces — MQLs — is no longer the thing your revenue runs on. Consumption is. AI credits are growing 126% annually, and almost nobody has a communications playbook for the change. Pricing is the module that closes that gap.',
      },
      {
        q: 'What is net revenue per account?',
        a: 'What an account is worth twelve months after signing, measured against what it signed for. Expansion revenue costs roughly half what acquiring a new customer does, so this is the number that captures whether you are actually collecting it. It is the single metric Pricing is accountable to.',
      },
      {
        q: 'How do you test packaging?',
        a: 'Pricing-page experiments run against real buyer conversion rather than internal opinion — variant, confidence, decision. The page becomes an instrument instead of a guess. Every test and its result is recorded in an experiment history you keep, and the programme runs as a continuous loop rather than a one-off redesign.',
      },
      {
        q: 'What triggers an expansion play?',
        a: 'Usage. Consumption, credit burn, seat saturation and expansion readiness are wired into dashboards your CS and sales teams see, then plays fire the week an account is ready: annual-plan proposals at renewal, top-up offers at credit thresholds, add-seat campaigns at saturation.',
      },
      {
        q: 'How do you reprice without losing customers?',
        a: 'With sequenced communication built for three audiences at once: existing customers, in-flight deals, and the sales team that has to defend the new number. 75% of your market will change pricing this year, and most will do it badly. The kit is yours to keep.',
      },
      {
        q: 'Why is Pricing not available yet?',
        a: 'Pricing is in build, with the waitlist open and delivery targeted at next quarter. It ships to existing Engine clients first — it needs their consumption data to be honest, and we do not sell what we cannot yet prove. The waitlist gets it next, with the case study attached.',
      },
    ],
    status: { label: 'In build — waitlist open', tone: 'build' },
    metric: {
      label: 'Net revenue per account', from: 100, to: 114, fmt: '%',
      def: 'What an account is worth twelve months after signing, against what it signed for. Expansion revenue costs roughly half of what acquisition does — this is the number that captures whether you’re collecting it.',
    },
    problem: {
      headline: 'Your pricing page is a hypothesis nobody is testing.',
      stat: '75%',
      statLine: 'of B2B software companies changed pricing or packaging in the past twelve months.',
      body: 'Hybrid pricing jumped from 25% to 37% of companies in a year. AI credits are growing 126% annually. And almost nobody has a communications playbook for any of it. Worse: if your product is usage- or credit-priced, the thing your marketing produces — MQLs — is no longer the thing your revenue runs on. Consumption is. This is the module that closes that gap.',
      support: [
        { n: '25% → 37%', l: 'companies on hybrid pricing, in twelve months' },
        { n: '~½', l: 'expansion CAC vs new-customer CAC' },
        { n: '126%', l: 'year-over-year growth in AI credit pricing' },
      ],
    },
    steps: [
      { t: 'Instrument consumption', d: 'Usage, credit burn, seat saturation, expansion readiness — wired into dashboards your CS and sales teams actually see, before renewals become surprises.' },
      { t: 'Test the packaging', d: 'Pricing-page experiments run against real buyer conversion, not opinion. Variant, confidence, decision — the page becomes an instrument instead of a guess.' },
      { t: 'Trigger expansion', d: 'Usage-fired plays, launched the week the account is ready: annual-plan proposals at renewal, top-up offers at credit thresholds, add-seat campaigns at saturation. The Signals architecture, pointed at accounts you already won.' },
      { t: 'Communicate change', d: 'Repricing sequences that keep trust — for existing customers, in-flight deals, and the sales team that has to defend the new number. 75% of your market will change pricing this year. Most will do it badly.' },
    ],
    keeps: [
      'Consumption and credit-burn dashboards',
      'The experiment history — every packaging test and its result',
      'The expansion play library, tuned to your usage patterns',
      'The repricing communications kit',
    ],
    deliver: [
      'Consumption instrumentation + dashboards',
      'Pricing-page experiment program',
      'Usage-triggered expansion campaigns',
      'Renewal and top-up play library',
      'Pricing-change communication sequences',
      'Monthly net-revenue-per-account report',
    ],
    cta: {
      h: 'In build. Deliberately.',
      s: 'Pricing ships to existing Engine clients first — it needs their consumption data to be honest, and we don’t sell what we can’t yet prove. The waitlist gets it next, with the case study attached.',
      btn: 'Join the Pricing waitlist',
      note: 'Next quarter · Engine clients first · no vaporware sold here',
    },
  },
};
