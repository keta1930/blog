import { Provider } from '@/components/provider';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import type { ReactNode } from 'react';

export function SiteRootLayout({
  children,
  lang,
}: {
  children: ReactNode;
  lang: 'en' | 'zh-CN';
}) {
  return (
    <html lang={lang} className="fd-scroll-container" suppressHydrationWarning>
      <body>
        <Provider>
          <div className="site-shell">
            <SiteHeader />
            <main className="site-main">{children}</main>
            <SiteFooter />
          </div>
        </Provider>
      </body>
    </html>
  );
}
