import { CopyMarkdownButton } from '@/components/copy-markdown-button';
import { getMDXComponents } from '@/components/mdx';
import { PostAudioPlayer } from '@/components/post-audio-player';
import { PostComments } from '@/components/post-comments';
import { PostToc } from '@/components/post-toc';
import type { SiteLocale } from '@/lib/i18n';
import {
  formatPostCategory,
  formatPostDate,
  formatReadingTime,
  getAdjacentPosts,
  getPost,
  getPostAudioUrl,
} from '@/lib/posts';
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { DocsBody } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function PostArticle({
  slug,
  locale,
}: {
  slug: string[];
  locale: SiteLocale;
}) {
  const post = getPost(slug, locale);
  if (!post) notFound();

  const { previous, next } = getAdjacentPosts(post, locale);
  const isChinese = locale === 'zh';
  const MDX = post.data.body;
  const audioUrl = getPostAudioUrl(post);
  const markdownUrl = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${getPageMarkdownUrl(post).url}`;

  return (
    <div className="post-layout">
      <article className="post-page" lang={isChinese ? 'zh-CN' : 'en'}>
        <header className="post-header">
          <Link href={isChinese ? '/zh/posts' : '/posts'} className="post-back-link">
            ← {isChinese ? '全部文章' : 'All posts'}
          </Link>
          <p className="post-kicker">{formatPostCategory(post.data.category, locale)}</p>
          <h1>{post.data.title}</h1>
          <p className="post-description">{post.data.description}</p>
          <div className="post-meta-row">
            <div className="post-byline">
              <span>{isChinese ? '作者 keta' : 'By keta'}</span>
              <time dateTime={post.data.publishedAt}>
                {isChinese ? '发布于 ' : 'Published '}{formatPostDate(post.data.publishedAt, locale)}
              </time>
              {post.data.updatedAt !== post.data.publishedAt ? (
                <time dateTime={post.data.updatedAt}>
                  {isChinese ? '更新于 ' : 'Updated '}{formatPostDate(post.data.updatedAt, locale)}
                </time>
              ) : null}
              <span>{formatReadingTime(post.data.readingTime, locale)}</span>
            </div>
            <CopyMarkdownButton markdownUrl={markdownUrl} isChinese={isChinese} />
          </div>
        </header>

        {audioUrl ? (
          <PostAudioPlayer key={audioUrl} src={audioUrl} isChinese={isChinese} />
        ) : null}

        <DocsBody className="post-body">
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, post),
            })}
          />
        </DocsBody>

        <nav className="post-pagination" aria-label={isChinese ? '上一篇与下一篇文章' : 'Adjacent posts'}>
          {previous ? (
            <Link href={previous.url} className="pagination-link pagination-previous">
              <span>{isChinese ? '上一篇' : 'Previous'}</span>
              <strong>{previous.data.title}</strong>
              <time dateTime={previous.data.publishedAt}>
                {formatPostDate(previous.data.publishedAt, locale)}
              </time>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={next.url} className="pagination-link pagination-next">
              <span>{isChinese ? '下一篇' : 'Next'}</span>
              <strong>{next.data.title}</strong>
              <time dateTime={next.data.publishedAt}>
                {formatPostDate(next.data.publishedAt, locale)}
              </time>
            </Link>
          ) : null}
        </nav>

        <PostComments slug={post.data.slug} locale={locale} />
      </article>
      <PostToc toc={post.data.toc} isChinese={isChinese} />
    </div>
  );
}

export function getPostMetadata(slug: string[], locale: SiteLocale): Metadata {
  const post = getPost(slug, locale);
  if (!post) notFound();

  const alternateLocale = locale === 'en' ? 'zh' : 'en';
  const alternatePost = getPost(slug, alternateLocale);

  return {
    title: post.data.title,
    description: post.data.description,
    alternates: alternatePost
      ? { languages: { [locale]: post.url, [alternateLocale]: alternatePost.url } }
      : undefined,
    openGraph: {
      type: 'article',
      title: post.data.title,
      description: post.data.description,
      publishedTime: post.data.publishedAt,
      modifiedTime: post.data.updatedAt,
      images: [getPageImage(post).url],
    },
  };
}
