'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './LoadingScreen.module.css';

const STORAGE_KEY = 'portfolio-loading-seen';
const MIN_DISPLAY_MS = 1400;
const MAX_WAIT_MS = 4500;

function waitForPageReady(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve();

  return new Promise((resolve) => {
    const onLoad = () => {
      window.removeEventListener('load', onLoad);
      resolve();
    };
    window.addEventListener('load', onLoad);
  });
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const startedAt = useRef(0);

  const finish = useCallback(() => {
    const elapsed = performance.now() - startedAt.current;
    const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);

    window.setTimeout(() => setExiting(true), delay);
  }, []);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'opacity' || !exiting) return;
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      return;
    }

    setVisible(true);
    startedAt.current = performance.now();

    let cancelled = false;
    let maxTimer: number | null = null;

    const scheduleExit = () => {
      if (cancelled) return;
      finish();
    };

    void waitForPageReady().then(scheduleExit);
    maxTimer = window.setTimeout(scheduleExit, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      if (maxTimer !== null) window.clearTimeout(maxTimer);
    };
  }, [finish]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${exiting ? styles.exiting : ''}`}
      role="status"
      aria-live="polite"
      aria-label="ページを読み込んでいます"
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.container}>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <p>LOADING</p>
      </div>
    </div>
  );
}
