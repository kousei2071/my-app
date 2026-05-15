'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AboutScrollContext } from './AboutScrollContext';
import styles from './AboutScrollStage.module.css';

/** ヘッダー色など、ステージ外の `window` リスナー用（detail: -1 = ステージ終了） */
export const ABOUT_SCROLL_PROGRESS_EVENT = 'about-scroll-progress';

type AboutScrollStageProps = {
  children: React.ReactNode;
};

/**
 * About ＋ 経歴ブロックを包み、縦スクロール量に応じて 0〜1 の進捗を子に配るラッパー。
 *
 * 進捗の求め方:
 * - `.stage` の上端がビューポート上端より上に行った分を「スクロールした量」とみなす
 * - progress = スクロールした量 / (stage の高さ − ウィンドウ高) を 0〜1 に clamp
 *
 * スクロールイベントは rAF で 1 フレームに 1 回だけ計測し、連続 setState / dispatch を抑える。
 */
export default function AboutScrollStage({ children }: AboutScrollStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [preferReducedMotion, setPreferReducedMotion] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPreferReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const measure = useCallback(() => {
    rafRef.current = 0;
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const scrollable = stage.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      setProgress(0);
      window.dispatchEvent(
        new CustomEvent<number>(ABOUT_SCROLL_PROGRESS_EVENT, { detail: 0 }),
      );
      return;
    }

    const scrolled = -rect.top;
    const raw = scrolled / scrollable;
    const next = Math.min(1, Math.max(0, raw));
    setProgress(next);
    window.dispatchEvent(
      new CustomEvent<number>(ABOUT_SCROLL_PROGRESS_EVENT, { detail: next }),
    );
  }, []);

  const scheduleMeasure = useCallback(() => {
    if (rafRef.current !== 0) return;
    rafRef.current = window.requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    if (preferReducedMotion) return;

    measure();
    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);

    return () => {
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      window.dispatchEvent(
        new CustomEvent<number>(ABOUT_SCROLL_PROGRESS_EVENT, { detail: -1 }),
      );
    };
  }, [preferReducedMotion, measure, scheduleMeasure]);

  const payload = useMemo(() => ({ progress }), [progress]);

  if (preferReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div ref={stageRef} className={styles.stage}>
      <AboutScrollContext.Provider value={payload}>
        <div id="about-scroll-hit" className={styles.sticky}>
          {children}
        </div>
      </AboutScrollContext.Provider>
    </div>
  );
}
