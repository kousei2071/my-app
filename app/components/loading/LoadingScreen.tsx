'use client';

import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

const STORAGE_KEY = 'portfolio-loading-seen';
const SHOW_DELAY_MS = 300;
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

    let cancelled = false;
    let showTimer: number | null = null;
    let maxTimer: number | null = null;
    const mountTime = performance.now();

    const markSeen = () => {
      sessionStorage.setItem(STORAGE_KEY, '1');
    };

    const finishWithoutLoader = () => {
      if (cancelled) return;
      cancelled = true;
      if (showTimer !== null) window.clearTimeout(showTimer);
      markSeen();
    };

    const finishWithLoader = () => {
      if (cancelled) return;
      cancelled = true;
      setVisible(true);
      setExiting(true);
    };

    const onReady = () => {
      if (cancelled) return;

      const elapsed = performance.now() - mountTime;
      if (elapsed < SHOW_DELAY_MS) {
        finishWithoutLoader();
        return;
      }

      finishWithLoader();
    };

    showTimer = window.setTimeout(() => {
      if (cancelled) return;

      if (document.readyState === 'complete') {
        finishWithoutLoader();
        return;
      }

      setVisible(true);
    }, SHOW_DELAY_MS);

    void waitForPageReady().then(onReady);

    maxTimer = window.setTimeout(() => {
      if (cancelled) return;
      finishWithLoader();
    }, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      if (showTimer !== null) window.clearTimeout(showTimer);
      if (maxTimer !== null) window.clearTimeout(maxTimer);
    };
  }, []);

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
