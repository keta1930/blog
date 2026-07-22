import { SiteRootLayout } from '@/components/site-root-layout';
import { siteMetadata } from '@/lib/site-metadata';
import type { ReactNode } from 'react';
import 'katex/dist/katex.css';
import '../global.css';

export const metadata = siteMetadata;

export default function ChineseLayout({ children }: { children: ReactNode }) {
  return <SiteRootLayout lang="zh-CN">{children}</SiteRootLayout>;
}
