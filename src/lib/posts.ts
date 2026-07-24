import type { SiteLocale } from './i18n';
import { source } from './source';

export type PostPage = (typeof source)['$inferPage'];

export function getPosts(locale: SiteLocale): PostPage[] {
  return [...source.getPages(locale)].sort((a, b) =>
    b.data.publishedAt.localeCompare(a.data.publishedAt),
  );
}

export function getLatestPost(locale: SiteLocale): PostPage | undefined {
  return getPosts(locale)[0];
}

export function getPost(slug: string[] | undefined, locale: SiteLocale): PostPage | undefined {
  return source.getPage(slug, locale);
}

export function getAdjacentPosts(post: PostPage, locale: SiteLocale) {
  const posts = getPosts(locale);
  const index = posts.findIndex((candidate) => candidate.url === post.url);

  return {
    previous: index >= 0 ? posts[index + 1] : undefined,
    next: index > 0 ? posts[index - 1] : undefined,
  };
}

export function formatPostDate(date: string, locale: SiteLocale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatReadingTime(minutes: number, locale: SiteLocale): string {
  return locale === 'zh' ? `约 ${minutes} 分钟读完` : `${minutes} min read`;
}

export function formatPostCategory(
  category: PostPage['data']['category'],
  locale: SiteLocale,
): string {
  const labels = {
    resource: { en: 'RESOURCE', zh: '资源' },
    insight: { en: 'INSIGHT', zh: '观点' },
    research: { en: 'RESEARCH', zh: '研究' },
  } as const;

  return labels[category][locale];
}

export function getPostAudioUrl(post: PostPage): string | undefined {
  const sourcePath = post.data.audio?.src;
  if (!sourcePath) return undefined;

  const filename = sourcePath.slice(sourcePath.lastIndexOf('/') + 1);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return `${basePath}/audio/${post.data.slug}/${encodeURIComponent(filename)}`;
}
