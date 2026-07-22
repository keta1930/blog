import { PostsPage } from '@/components/posts-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'A list of everything I’ve published here.',
};

export default function Page() {
  return <PostsPage locale="en" />;
}
