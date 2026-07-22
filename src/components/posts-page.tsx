import { PostListItem } from '@/components/post-list-item';
import type { SiteLocale } from '@/lib/i18n';
import { getPosts } from '@/lib/posts';

export function PostsPage({ locale }: { locale: SiteLocale }) {
  const posts = getPosts(locale);
  const isChinese = locale === 'zh';

  return (
    <section className="listing-page" lang={isChinese ? 'zh-CN' : 'en'}>
      <p className="eyebrow">{isChinese ? '全部文章' : 'ARCHIVE'}</p>
      <h1>{isChinese ? '文章' : 'Posts'}</h1>
      <p className="listing-intro">
        {isChinese
          ? '这里收录了我发布的全部文章。'
          : 'A list of everything I’ve published here.'}
      </p>
      <div className="archive-list">
        {posts.map((post, index) => (
          <PostListItem
            post={post}
            locale={locale}
            indexLabel={String(index + 1).padStart(2, '0')}
            key={post.url}
          />
        ))}
      </div>
    </section>
  );
}
