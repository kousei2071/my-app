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
 * - 全体でスクロール可能な量 = stage の高さ − ウィンドウ高
 * - progress = スクロールした量 / スクロール可能量（0〜1 に clamp）
 */
export default function AboutScrollStage({ children }: AboutScrollStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [preferReducedMotion, setPreferReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPreferReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const updateProgress = useCallback(() => {
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

  useEffect(() => {
    if (preferReducedMotion) return;

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      window.dispatchEvent(
        new CustomEvent<number>(ABOUT_SCROLL_PROGRESS_EVENT, { detail: -1 }),
      );
    };
  }, [preferReducedMotion, updateProgress]);

  const payload = useMemo(() => ({ progress }), [progress]);

  if (preferReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div ref={stageRef} className={styles.stage}>
      <AboutScrollContext.Provider value={payload}>
        <div id="about-scroll-hit" className={styles.sticky}>{children}</div>
      </AboutScrollContext.Provider>
    </div>
  );
}
