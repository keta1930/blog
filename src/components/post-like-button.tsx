'use client';

import { Triangle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_LIKES_API_URL;

const VOTER_ID_STORAGE_KEY = 'post-voter-id';
const VOTER_ID_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

interface LikeResponse {
  count: number;
  liked?: boolean;
}

interface LikePayload {
  action: 'like' | 'unlike';
  voter?: string;
}

/** localStorage 在隐私模式或存储被禁用时会抛错，这里统一降级为不可用。 */
const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): boolean {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
};

/** 读取或生成浏览器级匿名 ID；存储不可用时返回 null，交由服务端回退到 IP 去重。 */
function loadVoterId(): string | null {
  const stored = storage.get(VOTER_ID_STORAGE_KEY);
  if (stored && VOTER_ID_PATTERN.test(stored)) return stored;

  const created = crypto.randomUUID();
  return storage.set(VOTER_ID_STORAGE_KEY, created) ? created : null;
}

export function PostLikeButton({ slug, isChinese }: { slug: string; isChinese: boolean }) {
  const storageKey = `post-like:${slug}`;
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!apiUrl) return;
    let cancelled = false;

    const voter = loadVoterId();
    const query = voter ? `?voter=${encodeURIComponent(voter)}` : '';

    (async () => {
      let serverCount: number | null = null;
      let serverLiked: boolean | null = null;
      try {
        const response = await fetch(`${apiUrl}/likes/${slug}${query}`);
        if (!response.ok) throw new Error(`Unable to load like count: ${response.status}`);
        const data = (await response.json()) as LikeResponse;
        serverCount = data.count;
        serverLiked = data.liked ?? null;
      } catch {
        // 计数加载失败时仅隐藏数字，不影响点赞操作
      }
      if (cancelled) return;
      setCount(serverCount);
      // 以服务端记录校正本地状态，避免按钮显示与服务端真实投票脱节
      setLiked(serverLiked ?? (storage.get(storageKey) === '1'));
      if (serverLiked !== null) storage.set(storageKey, serverLiked ? '1' : '0');
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

    const payload: LikePayload = { action: nextLiked ? 'like' : 'unlike' };
    const voter = loadVoterId();
    if (voter) payload.voter = voter;

    try {
      const response = await fetch(`${apiUrl}/likes/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Unable to update like: ${response.status}`);

      // 服务端返回的 liked 是该投票人的真实记录状态，用它校正计数与本地状态
      const data = (await response.json()) as LikeResponse;
      const serverLiked = data.liked ?? nextLiked;
      setCount(data.count);
      setLiked(serverLiked);
      storage.set(storageKey, serverLiked ? '1' : '0');
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
