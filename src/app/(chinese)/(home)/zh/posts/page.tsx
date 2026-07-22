import { PostsPage } from '@/components/posts-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文章',
  description: '这里收录了我发布的全部文章。',
};

export default function Page() {
  return <PostsPage locale="zh" />;
}
