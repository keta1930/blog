'use client';

import { Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type CopyStatus = 'idle' | 'copying' | 'copied' | 'error';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

export function CopyMarkdownButton({
  markdownUrl,
  isChinese,
}: {
  markdownUrl: string;
  isChinese: boolean;
}) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const copyingRef = useRef(false);

  const copyMarkdown = useCallback(async () => {
    if (copyingRef.current) return;

    copyingRef.current = true;
    setStatus('copying');
    try {
      const response = await fetch(markdownUrl);
      if (!response.ok) throw new Error(`Unable to load Markdown: ${response.status}`);

      await navigator.clipboard.writeText(await response.text());
      setStatus('copied');
    } catch {
      setStatus('error');
    } finally {
      copyingRef.current = false;
    }
  }, [markdownUrl]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.metaKey
        || event.ctrlKey
        || event.altKey
        || event.key.toLowerCase() !== 'm'
        || isEditableTarget(event.target)
      ) return;

      event.preventDefault();
      void copyMarkdown();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [copyMarkdown]);

  const labels = isChinese
    ? { idle: '复制全文', copying: '复制中…', copied: '已复制', error: '复制失败' }
    : { idle: 'COPY TEXT', copying: 'Copying…', copied: 'Copied', error: 'Copy failed' };
  const isCopied = status === 'copied';

  return (
    <button
      type="button"
      className="copy-markdown-button"
      onClick={() => void copyMarkdown()}
      title={isChinese ? '复制全文（快捷键：M）' : 'COPY TEXT (keyboard shortcut: M)'}
      aria-live="polite"
    >
      {isCopied ? <Check size={15} /> : <Copy size={15} />}
      <span>{labels[status]}</span>
      <kbd>M</kbd>
    </button>
  );
}
