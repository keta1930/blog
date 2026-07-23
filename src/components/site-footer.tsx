import Link from 'next/link';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© 2026 keta</p>
      <div className="footer-links">
        <Link href="https://github.com/keta1930">GitHub</Link>
        <Link href="/rss.xml">RSS</Link>
        <a href={`${basePath}/llms.txt`}>LLMs TXT</a>
      </div>
    </footer>
  );
}
