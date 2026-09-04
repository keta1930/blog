'use client';

import { Triangle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_LIKES_API_URL;

interface LikeResponse {
  count: number;
  liked?: boolean;
}

export function PostLikeButton({ slug, isChinese }: { slug: string; isChinese: boolean }) {
  const storageKey = `post-like:${slug}`;
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!apiUrl) return;
    let cancelled = false;

    (async () => {
      let serverCount: number | null = null;
      try {
        const response = await fetch(`${apiUrl}/likes/${slug}`);
        if (!response.ok) throw new Error(`Unable to load like count: ${response.status}`);
        serverCount = ((await response.json()) as LikeResponse).count;
      } catch {
        // 计数加载失败时仅隐藏数字，不影响点赞操作
        serverCount = null;
      }
      if (cancelled) return;
      setCount(serverCount);
      setLiked(localStorage.getItem(storageKey) === '1');
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, storageKey]);

  const toggleLike = useCallback(async () => {
    if (!apiUrl || pending) return;

    // 先乐观更新，请求失败时回滚
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((current) => (current === null ? current : current + (nextLiked ? 1 : -1)));
    setPending(true);

    try {
      const response = await fetch(`${apiUrl}/likes/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: nextLiked ? 'like' : 'unlike' }),
      });
      if (!response.ok) throw new Error(`Unable to update like: ${response.status}`);

      const data = (await response.json()) as LikeResponse;
      setCount(data.count);
      localStorage.setItem(storageKey, nextLiked ? '1' : '0');
    } catch {
      setLiked(!nextLiked);
      setCount((current) => (current === null ? current : current + (nextLiked ? -1 : 1)));
    } finally {
      setPending(false);
    }
  }, [liked, pending, slug, storageKey]);

  if (!apiUrl) return null;

  const title = liked
    ? (isChinese ? '取消 Upvote' : 'Remove your upvote')
    : (isChinese ? 'Upvote 这篇文章' : 'Upvote this post');

  return (
    <button
      type="button"
      className={`post-like-button${liked ? ' is-liked' : ''}`}
      onClick={() => void toggleLike()}
      title={title}
      aria-pressed={liked}
      disabled={pending}
    >
      <Triangle size={10} fill="currentColor" strokeWidth={1} />
      <span>Upvote</span>
      {count === null ? null : <span className="post-like-button-count">{count}</span>}
    </button>
  );
}
