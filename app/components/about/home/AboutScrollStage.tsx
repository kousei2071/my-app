'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './styles/AboutScrollStage.module.css';

type AboutScrollStageProps = {
  children: ReactNode;
};

/**
 * About ブロックの出現演出（CSS のみ）。
 * progress + rAF は毎フレーム再描画になるため使わない。
 */
export default function AboutScrollStage({ children }: AboutScrollStageProps) {
  const hitRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setRevealed(true);
      return;
    }

    const el = hitRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        const vh = window.innerHeight;
        const targetH = entry.boundingClientRect.height;
        const visibleH = entry.intersectionRect.height;
        const needVisible = Math.min(vh * 0.5, targetH * 0.98);
        if (visibleH < needVisible) return;

        setRevealed(true);
        observer.disconnect();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="about-stage"
      className={`${styles.stage} ${revealed ? styles.revealed : ''}`}
    >
      <div id="about-scroll-hit" ref={hitRef} className={styles.hit}>
        {children}
      </div>
    </div>
  );
}
