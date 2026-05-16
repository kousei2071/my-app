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
import {
  ABOUT_STAGE_MIN_HEIGHT_VH,
  computeAboutScrollMotion,
  type AboutScrollMotion,
} from './scrollModel';
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

    const scrollable = stage.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      setProgress(0);
      return;
    }

    const scrolled = -stage.getBoundingClientRect().top;
    const next = Math.min(1, Math.max(0, scrolled / scrollable));
    setProgress(next);
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
    };
  }, [preferReducedMotion, measure, scheduleMeasure]);

  const scrollValue = useMemo(
    () => ({
      progress,
      motion: computeAboutScrollMotion(progress),
    }),
    [progress],
  );

  if (preferReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      style={{ ['--about-stage-min-height' as string]: `${ABOUT_STAGE_MIN_HEIGHT_VH}vh` }}
    >
      <AboutScrollProvider value={scrollValue}>
        <div id="about-scroll-hit" className={styles.sticky}>
          {children}
        </div>
      </AboutScrollProvider>
    </div>
  );
}
