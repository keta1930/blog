import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  buildIndex(page) {
    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      breadcrumbs: [page.locale === 'zh' ? '文章' : 'Posts'],
    };
  },
  localeMap: {
    en: { language: 'english' },
    zh: {
      components: { tokenizer: createTokenizer() },
      search: { threshold: 0, tolerance: 0 },
    },
  },
});
