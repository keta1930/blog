'use client';

import { TOCProvider, TOCScrollArea } from 'fumadocs-ui/components/toc';
import { TOCItem, TOCItems } from 'fumadocs-ui/components/toc/default';
import type { TOCItemType } from 'fumadocs-core/toc';
import { AlignLeft } from 'lucide-react';

export function PostToc({
  toc,
  isChinese,
}: {
  toc: TOCItemType[];
  isChinese: boolean;
}) {
  if (toc.length === 0) return null;

  return (
    <TOCProvider toc={toc}>
      <aside className="post-toc" aria-labelledby="post-toc-title">
        <h2 id="post-toc-title">
          <AlignLeft aria-hidden="true" size={15} />
          {isChinese ? '本页目录' : 'On this page'}
        </h2>
        <TOCScrollArea className="post-toc-scroll">
          <TOCItems className="post-toc-items">
            {toc.map((item) => <TOCItem item={item} key={item.url} />)}
          </TOCItems>
        </TOCScrollArea>
      </aside>
    </TOCProvider>
  );
}
