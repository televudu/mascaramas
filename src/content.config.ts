import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    year: z.number(),
    category: z.string(),
    cover: z.string().optional(),
    video: z.string().optional(),
    videoAspect: z.enum(['16:9', '4:3', '1:1', '9:16']).default('16:9'),
    gallery: z.array(z.string()).default([]),
    credits: z.array(z.string()).default([]),
    order: z.number().default(0),
    visible: z.boolean().default(true),
    theme: z.enum(['light', 'dark']).default('light'),
  }),
});

const sitio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sitio' }),
  schema: z.object({
    description: z.string(),
    email: z.email(),
    youtube: z.url(),
    instagram: z.url(),
  }),
});

export const collections = { proyectos, sitio };
