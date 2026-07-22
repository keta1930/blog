import { getPosts } from '@/lib/posts';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://keta1930.github.io/blog').replace(/\/$/, '');
export const revalidate = false;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] ?? character);
}

export function GET() {
  const items = getPosts('en').map((post) => `
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <description>${escapeXml(post.data.description)}</description>
      <link>${siteUrl}${post.url}</link>
      <guid>${siteUrl}${post.url}</guid>
      <pubDate>${new Date(`${post.data.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`).join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Keta’s Field Notes</title>
  <description>Posts on making, attention, and technology.</description>
  <link>${siteUrl}</link>${items}
</channel></rss>`;

  return new Response(feed, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
