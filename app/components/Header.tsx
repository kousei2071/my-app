'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { clamp01, segment, smoothstep01 } from './aboutScrollMath';
import { ABOUT_SCROLL_PROGRESS_EVENT } from './AboutScrollStage';
import styles from './Header.module.css';

/** Hero 上の白 (#fff) から About 帯の黒 (#171717) へ */
function mixNavRgb(t: number): string {
  const x = Math.min(1, Math.max(0, t));
  const r = Math.round(255 + (23 - 255) * x);
  const g = Math.round(255 + (23 - 255) * x);
  const b = Math.round(255 + (23 - 255) * x);
  return `rgb(${r} ${g} ${b})`;
}

/** ステージ進捗に沿った黒み（帯に入ってからゆっくり立ち上げ） */
function headerTintFromStageProgress(p: number): number {
  return smoothstep01(segment(p, 0.06, 0.48));
}

/** 固定ヘッダーと `#about` 本文ブロックの縦重なり（見た目の「上に乗った」度合い） */
function overlapAboutBlockTint(headerEl: HTMLElement): number {
  const about = document.getElementById('about');
  if (!about) return 0;
  const h = headerEl.getBoundingClientRect();
  const a = about.getBoundingClientRect();
  const overlap = Math.min(h.bottom, a.bottom) - Math.max(h.top, a.top);
  if (h.height <= 0) return 0;
  const raw = overlap <= 0 ? 0 : overlap / h.height;
  const startF = 0.1;
  const endF = 0.78;
  return clamp01((raw - startF) / (endF - startF));
}

function combinedHeaderTint(stageProgress: number, headerEl: HTMLElement | null): number {
  const tStage = headerTintFromStageProgress(stageProgress);
  const tDom = headerEl ? overlapAboutBlockTint(headerEl) : 0;
  return clamp01(0.32 * tStage + 0.68 * tDom);
}

const Header = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const stageModeRef = useRef(false);
  const [aboutT, setAboutT] = useState(0);

  useEffect(() => {
    const onStage = (e: Event) => {
      const d = (e as CustomEvent<number>).detail;
      if (d === -1) {
        stageModeRef.current = false;
        const he = headerRef.current;
        if (he) setAboutT(overlapAboutBlockTint(he));
        return;
      }
      stageModeRef.current = true;
      const he = headerRef.current;
      setAboutT(combinedHeaderTint(d, he));
    };
    window.addEventListener(ABOUT_SCROLL_PROGRESS_EVENT, onStage);
    return () => window.removeEventListener(ABOUT_SCROLL_PROGRESS_EVENT, onStage);
  }, []);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    let raf = 0;
    const tick = () => {
      if (stageModeRef.current) return;
      setAboutT(overlapAboutBlockTint(headerEl));
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    window.visualViewport?.addEventListener('resize', onScrollOrResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.visualViewport?.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  const navStyle = useMemo(
    (): CSSProperties => ({ color: mixNavRgb(aboutT) }),
    [aboutT],
  );

  return (
    <header
      ref={headerRef}
      className="fixed z-50 bg-transparent shadow-none top-4 left-4 right-4 w-auto sm:top-[50px] sm:left-[100px] sm:right-auto sm:w-[calc(100%-200px)]"
    >
      <nav className={`w-full px-0 py-3 sm:py-4 ${styles.nav}`} style={navStyle}>
        <h1 className={`text-2xl font-bold sm:text-3xl ${styles.title}`}>Kousei Tomita</h1>
        <ul className={`${styles.links} ${styles.linksResponsive}`}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/works">Works</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
