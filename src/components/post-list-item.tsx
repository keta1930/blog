import type { SiteLocale } from '@/lib/i18n';
import { formatPostDate, formatReadingTime, type PostPage } from '@/lib/posts';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function PostListItem({
  post,
  locale,
  indexLabel,
}: {
  post: PostPage;
  locale: SiteLocale;
  indexLabel: string;
}) {
  return (
    <Link href={post.url} className="archive-item">
      <span className="archive-index">{indexLabel}</span>
      <div>
        <p className="post-meta-line">
          <span>POST</span>
          <span>{formatReadingTime(post.data.readingTime, locale)}</span>
        </p>
        <h2>{post.data.title}</h2>
        <p className="archive-description">{post.data.description}</p>
      </div>
      <time dateTime={post.data.publishedAt}>
        {formatPostDate(post.data.publishedAt, locale)}
      </time>
      <ArrowUpRight size={18} />
    </Link>
  );
}
