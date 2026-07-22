'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

const chineseTranslations = {
  'Search(search dialog)': '搜索',
  'Close Search(search dialog)(aria-label)': '关闭搜索',
  'No results found(search dialog)': '未找到结果',
  'Copy Text(code block)(aria-label)': '复制代码',
  'Copied Text(code block)(aria-label)': '代码已复制',
  'Copy Anchor Link(heading anchor)(aria-label)': '复制标题链接',
};

export function Provider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChinese = pathname === '/zh' || pathname.startsWith('/zh/');

  return (
    <RootProvider
      search={{ SearchDialog }}
      theme={{ defaultTheme: 'system', enableSystem: true }}
      i18n={{
        locale: isChinese ? 'zh' : 'en',
        translations: isChinese ? chineseTranslations : {},
      }}
    >
      {children}
    </RootProvider>
  );
}
