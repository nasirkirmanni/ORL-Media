import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://orlmedia.com',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  // honor an assigned dev port (e.g. from the preview harness); default 4321
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4321 },
  vite: {
    plugins: [tailwindcss()],
  },
});
