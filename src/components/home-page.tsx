import { VintageAnimation } from '@/components/vintage-animation';
import { PostListItem } from '@/components/post-list-item';
import type { SiteLocale } from '@/lib/i18n';
import { getLatestPost } from '@/lib/posts';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function HomePage({ locale }: { locale: SiteLocale }) {
  const latestPost = getLatestPost(locale);
  const isChinese = locale === 'zh';

  return (
    <div className="home-page" lang={isChinese ? 'zh-CN' : 'en'}>
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            {isChinese ? <>念念不忘，<em>必有回响</em>。</> : <>Ideas worth <em>returning</em> to.</>}
          </h1>
          <p className="hero-copy">
            {isChinese
              ? '让想法像树一样生长。'
              : 'Let ideas grow like trees.'}
          </p>
          <div className="hero-actions">
            <Link href={isChinese ? '/zh/posts' : '/posts'} className="button-primary">
              {isChinese ? '阅读文章' : 'Read the posts'} <ArrowDownRight size={17} />
            </Link>
            <Link href={isChinese ? '/zh/about' : '/about'} className="text-link">
              {isChinese ? '关于我与本站' : 'A little about me'} <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <VintageAnimation locale={locale} />
      </section>

      {latestPost ? (
        <section className="home-now-section" aria-label={isChinese ? '最新文章' : 'Latest post'}>
          <div className="archive-list">
            <PostListItem post={latestPost} locale={locale} indexLabel="NOW" />
          </div>
        </section>
      ) : null}
    </div>
  );
}
