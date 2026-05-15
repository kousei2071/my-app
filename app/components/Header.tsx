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

/** About ステージの progress からナビの黒み 0〜1（ステージに入って少し経ったら暗くなる） */
function headerTintFromStageProgress(p: number): number {
  return smoothstep01(segment(p, 0.02, 0.2));
}

function overlapTintFromDOM(headerEl: HTMLElement): number {
  const aboutEl =
    document.getElementById('about-scroll-hit') ??
    document.getElementById('about');
  const h = headerEl.getBoundingClientRect();
  if (!aboutEl) return 0;
  const a = aboutEl.getBoundingClientRect();

  const overlap = Math.min(h.bottom, a.bottom) - Math.max(h.top, a.top);
  if (h.height <= 0) return 0;

  const raw = overlap <= 0 ? 0 : overlap / h.height;
  const startF = 0.15;
  const endF = 0.85;
  const t = (raw - startF) / (endF - startF);
  return clamp01(t);
}

const Header = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const stageModeRef = useRef(false);
  const [aboutT, setAboutT] = useState(0);

  /** ステージからの progress（`AboutScrollStage` が `CustomEvent` で配信） */
  useEffect(() => {
    const onStage = (e: Event) => {
      const d = (e as CustomEvent<number>).detail;
      if (d === -1) {
        stageModeRef.current = false;
        const he = headerRef.current;
        if (he) setAboutT(overlapTintFromDOM(he));
        return;
      }
      stageModeRef.current = true;
      setAboutT(headerTintFromStageProgress(d));
    };
    window.addEventListener(ABOUT_SCROLL_PROGRESS_EVENT, onStage);
    return () => window.removeEventListener(ABOUT_SCROLL_PROGRESS_EVENT, onStage);
  }, []);

  /** reduced-motion などでステージが無いとき: ヘッダーと `#about` の縦重なりで色を変える */
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    let raf = 0;
    const tick = () => {
      if (stageModeRef.current) return;
      setAboutT(overlapTintFromDOM(headerEl));
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
      className="fixed z-50 bg-transparent shadow-none top-[50px] left-[100px] w-[calc(100%-200px)]"
    >
      <nav className={`w-full px-0 py-4 ${styles.nav}`} style={navStyle}>
        <h1 className={`text-3xl font-bold ${styles.title}`}>Kousei Tomita</h1>
        <ul className={styles.links}>
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
