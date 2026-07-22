'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { useTheme } from 'fumadocs-ui/provider/base';
import { Languages, Moon, Search, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useEffectEvent } from 'react';

const englishLinks = [
  { href: '/about', label: 'About' },
  { href: '/posts', label: 'Posts' },
  { href: '/faqs', label: 'FAQs' },
];

const chineseLinks = [
  { href: '/zh/about', label: '关于' },
  { href: '/zh/posts', label: '文章' },
  { href: '/zh/faqs', label: '常见问题' },
];

function getLanguagePath(pathname: string): string {
  if (pathname === '/zh') return '/';
  if (pathname.startsWith('/zh/')) return pathname.slice(3) || '/';
  return pathname === '/' ? '/zh' : `/zh${pathname}`;
}

function isTextInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { setOpenSearch } = useSearchContext();
  const isChinese = pathname === '/zh' || pathname.startsWith('/zh/');
  const links = isChinese ? chineseLinks : englishLinks;
  const homeHref = isChinese ? '/zh' : '/';

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => router.push(getLanguagePath(pathname));

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey || isTextInput(event.target)) return;

    switch (event.key.toLowerCase()) {
      case 'd':
        event.preventDefault();
        toggleTheme();
        break;
      case 'l':
        event.preventDefault();
        toggleLanguage();
        break;
      case 'h':
        event.preventDefault();
        router.push(homeHref);
        break;
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  return (
    <header className="site-header">
      <Link
        href={homeHref}
        className="site-mark"
        aria-label={isChinese ? 'Keta 的田野笔记首页' : 'Keta’s Field Notes home'}
      >
        <span className="mark-dot" />
        <span>Keta’s Field Notes</span>
      </Link>
      <nav className="site-nav" aria-label={isChinese ? '主导航' : 'Primary navigation'}>
        <div className="nav-pages">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-controls">
          <button
            type="button"
            className="control-button search-button"
            onClick={() => setOpenSearch(true)}
            aria-label={isChinese ? '搜索文章' : 'Search posts'}
          >
            <Search size={15} />
            <span>{isChinese ? '搜索' : 'Search'}</span>
            <kbd>⌘K</kbd>
          </button>
          <button
            type="button"
            className="control-button icon-button"
            onClick={toggleTheme}
            aria-label={isChinese ? '切换明暗模式' : 'Toggle light or dark mode'}
          >
            <Sun className="theme-icon theme-icon-light" size={16} />
            <Moon className="theme-icon theme-icon-dark" size={16} />
          </button>
          <button
            type="button"
            className="control-button language-button"
            onClick={toggleLanguage}
            aria-label={isChinese ? '切换到英文' : 'Switch to Chinese'}
          >
            <Languages size={15} />
            <span>{isChinese ? 'EN' : '中'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
