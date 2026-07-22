import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

/* ─────────────────────────────────────────────────────────────
   Git-derived lastmod for the hand-written pages.

   Blog posts declare their own dates in frontmatter (below) and those
   win — an author saying when a piece changed beats a commit timestamp,
   which also moves for a typo fix. Everything else has no declared date,
   so the honest source is the last commit that touched its source file.

   THE SHALLOW-CLONE TRAP. Vercel clones shallow. In a shallow repo the
   oldest visible commit acts as a root: `git log -1 -- <file>` for a file
   NOT touched inside the window returns that boundary commit rather than
   nothing. Measured in a --depth=1 clone of this repo: about.astro last
   really changed at 14:44 but reported 16:08, the boundary commit's time.
   Every page would get stamped with the deploy time — the blanket "today"
   this file already warns against, wearing a per-file disguise, and the
   kind of inaccuracy Google responds to by discounting lastmod site-wide.

   So in a shallow clone we trust a date only if it is strictly NEWER than
   the boundary. At or before it, "changed then" and "unknown" are the same
   observation, and unknown means no lastmod.
   ───────────────────────────────────────────────────────────── */
const git = (...args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return ''; // no git, no .git dir, tarball deploy — all mean "unknown"
  }
};

const gitOk = existsSync('.git') && git('rev-parse', '--is-inside-work-tree') === 'true';
const isShallow = gitOk && git('rev-parse', '--is-shallow-repository') === 'true';
/* Oldest commit still visible. In a full clone this is the true root and
   nothing can sort at-or-before it except the root itself, so the guard
   below costs nothing there. */
const boundary = gitOk ? git('log', '--format=%cI', '--reverse').split('\n')[0] : '';

const gitLastmod = (file) => {
  if (!gitOk) return null;
  const d = git('log', '-1', '--format=%cI', '--', file);
  if (!d) return null;
  if (isShallow && boundary && d <= boundary) return null;
  return d;
};

/* Which source file actually governs each URL's content. Styling and
   component churn deliberately does not count — Google asks for the last
   time the CONTENT meaningfully changed, and bumping every URL because a
   colour token moved is how the signal stops being believed. */
const PAGE_SOURCES = {
  '/': 'src/pages/index.astro',
  '/about/': 'src/pages/about.astro',
  '/audit/': 'src/pages/audit.astro',
  '/blog/': 'src/pages/blog/index.astro',
  '/book/': 'src/pages/book.astro',
  '/results/': 'src/pages/results.astro',
  '/engine/': 'src/pages/engine/index.astro',
  '/engine/visibility/': 'src/pages/engine/visibility.astro',
  /* The three module pages are generated from one template, but their prose
     lives in modules.ts — so that file is the one that dates them. */
  '/engine/pricing/': 'src/lib/modules.ts',
  '/engine/proof/': 'src/lib/modules.ts',
  '/engine/signals/': 'src/lib/modules.ts',
};

/* Real publish dates for the blog, read straight from frontmatter so the
   sitemap's lastmod is TRUE rather than a blanket build timestamp.
   Google discounts lastmod it finds to be inaccurate, and stamping every
   URL with "today" on each deploy is exactly how that trust is lost —
   so pages with no known modification date get no lastmod at all. */
const postDates = Object.fromEntries(
  readdirSync('./src/content/blog')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const src = readFileSync(`./src/content/blog/${f}`, 'utf8');
      /* The optional quote class is load-bearing: YAML permits `date: 2026-06-18`
         and `date: "2026-06-18"` interchangeably, and without it the first
         quoted date anyone writes silently drops that URL's lastmod — no error,
         no warning, just a sitemap entry that quietly stops declaring freshness. */
      const updated = src.match(/^updated:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
      const date = src.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
      return [`/blog/${f.replace(/\.md$/, '')}/`, (updated ?? date)?.[1] ?? null];
    })
    .filter(([, d]) => d),
);

/* Counted during serialize and reported at build end. Without this the
   shallow-clone guard fails silently on Vercel — the sitemap would just
   quietly lose its dates and nobody would find out from the build log. */
let stamped = 0;
const unstamped = [];

export default defineConfig({
  site: 'https://www.orlmedia.agency',
  integrations: [
    sitemap({
      /* changefreq and priority are deliberately omitted — Google has
         stated publicly that it ignores both. lastmod it does use. */
      serialize(item) {
        const path = new URL(item.url).pathname;
        /* Author-declared frontmatter first, git second, nothing third. */
        const stamp = postDates[path] ?? (PAGE_SOURCES[path] ? gitLastmod(PAGE_SOURCES[path]) : null);
        if (stamp) {
          item.lastmod = stamp;
          stamped++;
        } else {
          unstamped.push(path);
        }
        return item;
      },
    }),
    /* Must come AFTER sitemap(): astro:build:done hooks fire in integration
       order, and serialize() runs inside the sitemap's own build:done. Listed
       first, this reported 0/0 every time — the exact silent success it exists
       to rule out. */
    {
      name: 'lastmod-report',
      hooks: {
        'astro:build:done': () => {
          console.log(
            `[lastmod] git ${gitOk ? (isShallow ? `available (SHALLOW, boundary ${boundary})` : 'available (full clone)') : 'UNAVAILABLE'} — ` +
            `${stamped} URLs stamped, ${unstamped.length} without lastmod` +
            (unstamped.length ? `: ${unstamped.join(' ')}` : ''),
          );
        },
      },
    },
  ],
  devToolbar: { enabled: false },
  // honor an assigned dev port (e.g. from the preview harness); default 4321
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4321 },
  vite: {
    plugins: [tailwindcss()],
  },
});
