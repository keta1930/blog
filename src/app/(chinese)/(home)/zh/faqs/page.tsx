import { FaqsPage } from '@/components/faqs-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '常见问题',
  description: '关于这个网站的一些简单说明。',
};

export default function Page() {
  return <FaqsPage locale="zh" />;
}
