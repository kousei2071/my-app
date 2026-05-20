'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { computeAboutScrollMotion, type AboutScrollMotion } from '../shared/scrollModel';
import styles from './styles/AboutScrollStage.module.css';

export type AboutScrollValue = {
  progress: number;
  motion: AboutScrollMotion;
};

const AboutScrollContext = createContext<AboutScrollValue | null>(null);

/** ステージ内の子だけが使う（Header は Provider の外） */
export function useAboutScroll(): AboutScrollValue | null {
  return useContext(AboutScrollContext);
}

function AboutScrollProvider({
  value,
  children,
}: {
  value: AboutScrollValue;
  children: ReactNode;
}) {
  return (
    <AboutScrollContext.Provider value={value}>{children}</AboutScrollContext.Provider>
  );
}

type AboutScrollStageProps = {
  children: ReactNode;
};

/** reveal アニメーションの長さ（ms）。prefers-reduced-motion では使わない */
const REVEAL_DURATION_MS = 1720;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export default function AboutScrollStage({ children }: AboutScrollStageProps) {
  const hitRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [preferReducedMotion, setPreferReducedMotion] = useState(false);
  const revealedRef = useRef(false);
  const animFrameRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPreferReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const startRevealAnimation = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;

    const start = performance.now();

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / REVEAL_DURATION_MS);
      setProgress(easeOutCubic(raw));
      if (raw < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (preferReducedMotion) return;

    const el = hitRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || revealedRef.current) return;

        const vh = window.innerHeight;
        const targetH = entry.boundingClientRect.height;
        const visibleH = entry.intersectionRect.height;
        const needVisible = Math.min(vh * 0.5, targetH * 0.98);
        if (visibleH < needVisible) return;

        startRevealAnimation();
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px',
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [preferReducedMotion, startRevealAnimation]);

  const scrollValue = useMemo(
    () => ({
      progress,
      motion: computeAboutScrollMotion(progress),
    }),
    [progress],
  );

  if (preferReducedMotion) {
    return (
      <div id="about-stage" className={styles.stage}>
        <div id="about-scroll-hit" className={styles.hit}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div id="about-stage" className={styles.stage}>
      <AboutScrollProvider value={scrollValue}>
        <div id="about-scroll-hit" ref={hitRef} className={styles.hit}>
          {children}
        </div>
      </AboutScrollProvider>
    </div>
  );
}
