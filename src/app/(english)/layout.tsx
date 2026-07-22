import { SiteRootLayout } from '@/components/site-root-layout';
import { siteMetadata } from '@/lib/site-metadata';
import type { ReactNode } from 'react';
import 'katex/dist/katex.css';
import '../global.css';

export const metadata = siteMetadata;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteRootLayout lang="en">{children}</SiteRootLayout>;
}
