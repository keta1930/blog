import { AboutPage } from '@/components/about-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于',
  description: 'keta 的个人写作空间，用来整理学习记录和个人文章。',
};

export default function Page() {
  return <AboutPage locale="zh" />;
}
