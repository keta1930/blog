import { appName } from '@/lib/shared';
import { getPageImage, source } from '@/lib/source';
import { emptyContentSlug, withEmptyContentFallback } from '@/lib/static-params';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { ImageResponse } from 'next/og';
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

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={appName} />,
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  const params = source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
  return withEmptyContentFallback(params, {
    slug: ['en', emptyContentSlug, 'image.png'],
  });
}
