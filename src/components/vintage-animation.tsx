'use client';

import type { SiteLocale } from '@/lib/i18n';
import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';

const growthStages = [1, 2, 3, 4] as const;
const growthStorageKey = 'keta-home-tree-growth-v1';
const treeImageUrl = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/home-tree.png`;

type LeafStyle = CSSProperties & { [key: `--${string}`]: string | number };

const leafStyles: LeafStyle[] = [
  { '--leaf-left': '30%', '--leaf-top': '28%', '--leaf-drift': '78px', '--leaf-delay': '0s', '--leaf-duration': '2.5s', '--leaf-turn': '250deg' },
  { '--leaf-left': '42%', '--leaf-top': '20%', '--leaf-drift': '108px', '--leaf-delay': '0.35s', '--leaf-duration': '3.1s', '--leaf-turn': '330deg' },
  { '--leaf-left': '54%', '--leaf-top': '27%', '--leaf-drift': '86px', '--leaf-delay': '0.8s', '--leaf-duration': '2.7s', '--leaf-turn': '290deg' },
  { '--leaf-left': '62%', '--leaf-top': '36%', '--leaf-drift': '122px', '--leaf-delay': '1.15s', '--leaf-duration': '3.4s', '--leaf-turn': '380deg' },
  { '--leaf-left': '37%', '--leaf-top': '42%', '--leaf-drift': '94px', '--leaf-delay': '1.55s', '--leaf-duration': '3s', '--leaf-turn': '310deg' },
  { '--leaf-left': '56%', '--leaf-top': '48%', '--leaf-drift': '72px', '--leaf-delay': '1.9s', '--leaf-duration': '2.8s', '--leaf-turn': '270deg' },
];

type AnimationPhase = 'pending' | 'growing' | 'settled';

export function VintageAnimation({ locale }: { locale: SiteLocale }) {
  const [phase, setPhase] = useState<AnimationPhase>('pending');
  const isChinese = locale === 'zh';

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hasPlayed = false;

    try {
      hasPlayed = window.localStorage.getItem(growthStorageKey) === 'played';
      if (!hasPlayed) window.localStorage.setItem(growthStorageKey, 'played');
    } catch {
      // The animation still works when browser storage is unavailable.
    }

    const frame = window.requestAnimationFrame(() => {
      setPhase(!hasPlayed && !prefersReducedMotion ? 'growing' : 'settled');
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`vintage-visual tree-animation tree-animation--${phase}`} aria-hidden="true">
      <div className="vintage-caption">
        <span>{isChinese ? '植物观察' : 'BOTANICAL STUDY'}</span>
        <span>{isChinese ? '第 01 号' : '№ 01'}</span>
      </div>

      <div className="tree-study">
        <div className="wind-lines">
          <span />
          <span />
          <span />
        </div>

        {growthStages.map((stage) => (
          <div className={`tree-growth-stage tree-growth-stage-${stage}`} key={stage}>
            <Image
              src={treeImageUrl}
              alt=""
              width={512}
              height={512}
              sizes="(max-width: 680px) 260px, 310px"
              loading="eager"
              draggable={false}
            />
          </div>
        ))}

        <div className="falling-leaves">
          {leafStyles.map((style, index) => (
            <span className="falling-leaf" style={style} key={index} />
          ))}
        </div>
      </div>

      <p>{isChinese ? '将鼠标移到树上，看看风经过。' : 'Move over the tree and watch the wind pass through.'}</p>
    </div>
  );
}
