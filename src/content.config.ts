import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['AI Search', 'Retention', 'Pipeline', 'Market', 'Operations']),
    readTime: z.string(),
    featured: z.boolean().default(false),
    // Longform pieces that close with their own CTA panel suppress the
    // generic aside, so readers don't hit two CTAs back to back.
    hideCta: z.boolean().default(false),
  }),
});

export const collections = { blog };
