'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'fumadocs-ui/provider/base';
import type { SiteLocale } from '@/lib/i18n';

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://keta1930.github.io/blog').replace(/\/$/, '');

const giscusThemes = {
  light: `${siteUrl}/giscus-light.css`,
  dark: `${siteUrl}/giscus-dark.css`,
} as const;

const giscusConfig = repo && repo.includes('/') && repoId && category && categoryId
  ? {
      repo: repo as `${string}/${string}`,
      repoId,
      category,
      categoryId,
    }
  : null;

export function PostComments({ slug, locale }: { slug: string; locale: SiteLocale }) {
  const { resolvedTheme } = useTheme();
  if (!giscusConfig) return null;

  const isChinese = locale === 'zh';

  return (
    <section className="post-comments" aria-labelledby="post-comments-title">
      <div className="post-comments-heading">
        <p>{isChinese ? '讨论' : 'DISCUSSION'}</p>
        <h2 id="post-comments-title">{isChinese ? '评论' : 'Comments'}</h2>
      </div>
      <Giscus
        id="post-comments"
        repo={giscusConfig.repo}
        repoId={giscusConfig.repoId}
        category={giscusConfig.category}
        categoryId={giscusConfig.categoryId}
        mapping="specific"
        term={`post:${slug}`}
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? giscusThemes.dark : giscusThemes.light}
        lang={isChinese ? 'zh-CN' : 'en'}
        loading="lazy"
      />
    </section>
  );
}
