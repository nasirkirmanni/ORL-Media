import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Optional SERP title. Headlines here run long by design — several
    // exceed 60 chars and truncate in results. Set this to a tighter
    // variant when that matters; the on-page H1 still uses `title`.
    seoTitle: z.string().optional(),
    description: z.string(),
    // Optional SERP meta description. The visible `description` doubles as
    // the on-page standfirst and card blurb, so several run past the ~160
    // char SERP limit by design. This overrides it for <meta> only.
    seoDescription: z.string().optional(),
    date: z.coerce.date(),
    // Optional republish date. Answer engines weight freshness heavily,
    // so a substantive edit should bump this — it drives dateModified in
    // the Article JSON-LD. Omit it and dateModified falls back to `date`.
    updated: z.coerce.date().optional(),
    category: z.enum(['AI Search', 'Retention', 'Pipeline', 'Market', 'Operations']),
    readTime: z.string(),
    featured: z.boolean().default(false),
    // Longform pieces that close with their own CTA panel suppress the
    // generic aside, so readers don't hit two CTAs back to back.
    hideCta: z.boolean().default(false),
  }),
});

export const collections = { blog };
