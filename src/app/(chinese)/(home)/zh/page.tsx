import { HomePage } from '@/components/home-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Keta 的田野笔记' },
  description: 'keta 关于创造、注意力、技术与日常观察的个人写作。',
};

export default function Page() {
  return <HomePage locale="zh" />;
}
