import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins/remark-mdx-mermaid';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      description: z.string().min(1),
      publishedAt: z.iso.date(),
      updatedAt: z.iso.date(),
      readingTime: z.number().int().positive(),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      audio: z.object({
        src: z.string().regex(/^\.\/assets\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:mp3|m4a|ogg|wav)$/i),
      }).optional(),
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      addLanguageClass: true,
      themes: {
        light: 'rose-pine-dawn',
        dark: 'rose-pine-moon',
      },
    },
    remarkPlugins: [remarkMath, remarkMdxMermaid],
    rehypePlugins: (plugins) => [rehypeKatex, ...plugins],
  },
});
