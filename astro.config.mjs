import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';

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
      const updated = src.match(/^updated:\s*(\d{4}-\d{2}-\d{2})/m);
      const date = src.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
      return [`/blog/${f.replace(/\.md$/, '')}/`, (updated ?? date)?.[1] ?? null];
    })
    .filter(([, d]) => d),
);

export default defineConfig({
  site: 'https://www.orlmedia.agency',
  integrations: [
    sitemap({
      /* changefreq and priority are deliberately omitted — Google has
         stated publicly that it ignores both. lastmod it does use. */
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (postDates[path]) item.lastmod = postDates[path];
        return item;
      },
    }),
  ],
  devToolbar: { enabled: false },
  // honor an assigned dev port (e.g. from the preview harness); default 4321
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4321 },
  vite: {
    plugins: [tailwindcss()],
  },
});
