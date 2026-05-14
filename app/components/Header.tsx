'use client';

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const [aboutT, setAboutT] = useState(0); // 0..1 (white -> black)

  useEffect(() => {
    const aboutEl = document.getElementById('about');
    const headerEl = headerRef.current;
    if (!aboutEl || !headerEl) return;

    let raf = 0;
    const update = () => {
      const h = headerEl.getBoundingClientRect();
      const a = aboutEl.getBoundingClientRect();

      // ヘッダーと About の「縦の重なり具合」を使って、色を白->黒へ徐々に変える
      const overlap = Math.min(h.bottom, a.bottom) - Math.max(h.top, a.top);
      if (h.height <= 0) {
        setAboutT(0);
        return;
      }

      const raw = overlap <= 0 ? 0 : overlap / h.height; // 0..1+

      // すぐ切り替わらないよう開始/終了を少し遅らせて「いい感じのところ」から段階的に
      const startF = 0.15; // ヘッダーの15%分重なったら開始
      const endF = 0.85; // 85%重なったら完了
      const t = (raw - startF) / (endF - startF);
      const clamped = Math.min(1, Math.max(0, t));
      setAboutT(clamped);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  const navStyle = useMemo(() => {
    // CSS color-mix 用に 0%..100% を渡す
    const t = `${aboutT * 100}%`;
    return { ['--t' as any]: t };
  }, [aboutT]);

  return (
    <header
      ref={headerRef}
      className="fixed z-50 bg-transparent shadow-none top-[50px] left-[100px] w-[calc(100%-200px)]"
    >
        <nav className={`w-full px-0 py-4 ${styles.nav}`} style={navStyle}>
            <h1 className={`text-3xl font-bold ${styles.title}`}>Kousei Tomita</h1>
            <ul className={styles.links}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/works">Works</Link></li>
            </ul>
        </nav>
    </header>
  );
};

export default Header;
