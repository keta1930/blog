import { getPostMetadata, PostArticle } from '@/components/post-article';
import { source } from '@/lib/source';
import { emptyContentSlug, withEmptyContentFallback } from '@/lib/static-params';

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <PostArticle slug={slug} locale="en" />;
}

export function generateStaticParams() {
  const params = source.getPages('en').map((post) => ({ slug: post.slugs }));
  return withEmptyContentFallback(params, { slug: [emptyContentSlug] });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return getPostMetadata(slug, 'en');
}
