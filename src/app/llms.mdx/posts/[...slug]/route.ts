import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source';
import { emptyContentSlug, withEmptyContentFallback } from '@/lib/static-params';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const [locale, ...pageSegments] = slug;
  const page = source.getPage(pageSegments.slice(0, -1), locale);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export function generateStaticParams() {
  const params = source.getPages().map((page) => ({
    slug: getPageMarkdownUrl(page).segments,
  }));
  return withEmptyContentFallback(params, {
    slug: ['en', emptyContentSlug, 'content.md'],
  });
}
