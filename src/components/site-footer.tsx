import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© 2026 keta</p>
      <div className="footer-links">
        <Link href="https://github.com/keta1930">GitHub</Link>
        <Link href="/rss.xml">RSS</Link>
        <Link href="/llms.txt">LLMs TXT</Link>
      </div>
    </footer>
  );
}
