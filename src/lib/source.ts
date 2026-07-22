import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { i18n } from './i18n';
import { postContentRoute, postImageRoute, postsRoute } from './shared';

export const source = loader({
  baseUrl: postsRoute,
  source: docs.toFumadocsSource(),
  i18n,
  plugins: [],
  slugs: (file) => [file.data.slug],
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [page.locale ?? i18n.defaultLanguage, ...page.slugs, 'image.png'];

  return {
    segments,
    url: `${postImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [page.locale ?? i18n.defaultLanguage, ...page.slugs, 'content.md'];

  return {
    segments,
    url: `${postContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const raw = await page.data.getText('raw');

  return `${raw.trim()}\n`;
}
