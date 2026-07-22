import { HomePage } from '@/components/home-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Keta’s Field Notes' },
  description: 'Essays on making, attention, technology, and quiet systems by keta.',
};

export default function Page() {
  return <HomePage locale="en" />;
}
