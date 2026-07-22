import type { SiteLocale } from '@/lib/i18n';
import { getPosts } from '@/lib/posts';
import { getPageMarkdownUrl } from '@/lib/source';

export const revalidate = false;

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://keta1930.github.io/blog').replace(/\/$/, '');

function escapeLabel(value: string): string {
  return value.replace(/[\[\]\\]/g, '\\$&');
}

function createSection(locale: SiteLocale, heading: string): string {
  const entries = getPosts(locale).map((post) => {
    const pageUrl = `${siteUrl}${post.url}`;
    const markdownUrl = `${siteUrl}${getPageMarkdownUrl(post).url}`;
    return `- [${escapeLabel(post.data.title)}](${pageUrl}): ${post.data.description} ([Markdown](${markdownUrl}))`;
  });

  return `## ${heading}\n\n${entries.join('\n')}`;
}

export function GET() {
  const index = [
    '# Keta’s Field Notes',
    '> Bilingual posts on making, attention, technology, and quiet systems by keta.',
    createSection('en', 'Posts'),
    createSection('zh', '中文文章'),
  ].join('\n\n');

  return new Response(index, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
