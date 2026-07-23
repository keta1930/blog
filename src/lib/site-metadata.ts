import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://keta1930.github.io/blog';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Keta’s Field Notes',
    template: '%s · Keta’s Field Notes',
  },
  description: 'Essays on making, attention, technology, and quiet systems by keta.',
  authors: [{ name: 'keta', url: 'https://github.com/keta1930' }],
  manifest: `${basePath}/manifest.webmanifest`,
};
