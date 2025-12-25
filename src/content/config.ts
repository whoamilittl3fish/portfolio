import { defineCollection, z } from 'astro:content';

const blogsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

const homeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    timeline: z.array(z.object({
      year: z.string(),
      text: z.string(),
    })).optional(),
  }),
});

export const collections = {
  'blogs': blogsCollection,
  'home': homeCollection,
};

