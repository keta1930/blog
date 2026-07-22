import { FaqsPage } from '@/components/faqs-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'A few notes about this site.',
};

export default function Page() {
  return <FaqsPage locale="en" />;
}
