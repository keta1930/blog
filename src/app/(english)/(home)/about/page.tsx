import { AboutPage } from '@/components/about-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Keta’s personal writing space for learning notes and personal essays.',
};

export default function Page() {
  return <AboutPage locale="en" />;
}
