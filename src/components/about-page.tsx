import type { SiteLocale } from '@/lib/i18n';
import Link from 'next/link';

const shortcuts = [
  { keys: '⌘ / Ctrl + K', en: 'Open search', zh: '打开搜索' },
  { keys: 'D', en: 'Toggle light/dark mode', zh: '切换明暗模式' },
  { keys: 'L', en: 'Switch language', zh: '切换语言' },
  { keys: 'H', en: 'Return home', zh: '回到首页' },
  { keys: 'M', en: 'Copy full post text', zh: '复制全文' },
];

export function AboutPage({ locale }: { locale: SiteLocale }) {
  const isChinese = locale === 'zh';

  return (
    <section className="about-page" lang={isChinese ? 'zh-CN' : 'en'}>
      <div className="about-main">
        <p className="eyebrow">{isChinese ? '关于' : 'ABOUT'}</p>
        <h1>{isChinese ? '一个从容地公开思考的地方。' : 'A place to think in public, slowly.'}</h1>
        <div className="about-copy">
          <p>
            {isChinese
              ? '这里是 keta 的个人写作空间，我在这里整理学习记录和个人文章。'
              : 'This is keta’s personal writing space, where I organize learning notes and personal essays.'}
          </p>
          <p>
            {isChinese ? '本站内容使用 MDX 编写，并以静态网站形式发布。你可以通过 ' : 'The site’s content is written in MDX and published as a static site. Subscribe via '}
            <Link href="/rss.xml">RSS</Link>
            {isChinese ? ' 订阅更新，或在 ' : ', or view the source and author profile on '}
            <Link href="https://github.com/keta1930">GitHub</Link>{isChinese ? '。' : '.'}
          </p>
        </div>
      </div>
      <aside className="shortcut-note" aria-labelledby="shortcut-title">
        <p className="note-pin">✦</p>
        <h2 id="shortcut-title">{isChinese ? '快捷键' : 'Keyboard shortcuts'}</h2>
        <p>{isChinese ? '在任何页面都能快速操作' : 'Shortcuts available on every page'}</p>
        <dl>
          {shortcuts.map((shortcut) => (
            <div key={shortcut.keys}>
              <dt><kbd>{shortcut.keys}</kbd></dt>
              <dd>{isChinese ? shortcut.zh : shortcut.en}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </section>
  );
}
