import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
		categories: z.string(),
		tags: z.array(z.union([z.string(), z.number()])).optional(),
		id: z.union([z.string(), z.number()]),
		cover: z.string().optional(),
		recommend: z.boolean().optional(),
		hide: z.boolean().optional(),
		top: z.boolean().optional()
	}),
});

export const collections = { blog };
