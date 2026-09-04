'use client';

import { Triangle } from 'lucide-react';
import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_LIKES_API_URL;

interface LikeResponse {
  count: number;
}

export function PostLikeCount({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!apiUrl) return;
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(`${apiUrl}/likes/${slug}`);
        if (!response.ok) throw new Error(`Unable to load like count: ${response.status}`);
        const data = (await response.json()) as LikeResponse;
        if (!cancelled) setCount(data.count);
      } catch {
        // 列表计数加载失败时不渲染徽标，不影响列表本身
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!apiUrl || count === null) return null;

  return (
    <span className="post-like-count" aria-label={`Upvotes: ${count}`}>
      <Triangle size={8} fill="currentColor" strokeWidth={1} />
      {count}
    </span>
  );
}
