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
    sub: 'Buyers now ask AI before they ever search your name. Visibility is the system that puts you inside the answer — and keeps you there.',
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
    sub: 'At any moment, roughly 5% of your market is in a buying window. Signals is the system that tells you which 5% — before they raise a hand.',
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
    sub: 'Your pipeline doesn’t die at the top of the funnel. It dies in security review, in committee, in "no decision." Proof is the system that arms the deal.',
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
    sub: 'Winning the deal is half the revenue. Pricing is the system that turns packaging, usage, and expansion into the other half — the half at half the CAC.',
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
