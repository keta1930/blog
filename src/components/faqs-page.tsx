import type { SiteLocale } from '@/lib/i18n';
import Link from 'next/link';

const faqContent = {
  en: [
    ['How will I know when a new post is published?', <>Subscribe to the <Link href="/rss.xml">RSS feed</Link>—the site’s only update channel.</>],
    ['Will every post be available in Chinese and English?', 'Yes. Every published post has matching English and Chinese versions. Use the language button to switch between them.'],
    ['Do you update older posts?', 'Yes. If a post is revised, the page shows both its original publication date and its latest revision date.'],
    ['What is this site built with?', 'The site is built with Fumadocs, Next.js, and MDX, and statically exported to GitHub Pages.'],
    ['What should I do if I find an error?', <>Please let me know on <Link href="https://github.com/keta1930">GitHub</Link>. Corrections are always welcome.</>],
  ],
  zh: [
    ['如何知道有新文章发布？', <>订阅本站的 <Link href="/rss.xml">RSS</Link>；这是目前唯一的更新订阅方式。</>],
    ['每篇文章都会同时提供中文和英文吗？', '会。每篇已发布文章都有对应的中英文版本，点击语言按钮即可在两种版本之间切换。'],
    ['旧文章会更新吗？', '会。文章修订后，页面会同时显示首次发布日期和最近更新日期。'],
    ['这个网站是用什么构建的？', '本站使用 Fumadocs、Next.js 和 MDX 构建，并以静态网站形式部署在 GitHub Pages 上。'],
    ['如果发现错误怎么办？', <>如果发现错误，欢迎通过 <Link href="https://github.com/keta1930">GitHub</Link> 告诉我，也非常感谢任何勘误或修正。</>],
  ],
};

export function FaqsPage({ locale }: { locale: SiteLocale }) {
  const isChinese = locale === 'zh';
  const items = faqContent[locale];

  return (
    <section className="faqs-page" lang={isChinese ? 'zh-CN' : 'en'}>
      <p className="eyebrow">{isChinese ? '常见问题' : 'QUESTIONS & ANSWERS'}</p>
      <h1>{isChinese ? '常见问题' : 'FAQs'}</h1>
      <p className="listing-intro">
        {isChinese ? '关于这个网站的一些简单说明。' : 'A few notes about this site.'}
      </p>
      <ol className="faq-list">
        {items.map(([question, answer], index) => (
          <li className="faq-item" key={question as string}>
            <span className="faq-index">Q{String(index + 1).padStart(2, '0')}</span>
            <h2>{question}</h2>
            <div className="faq-answer">{answer}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
