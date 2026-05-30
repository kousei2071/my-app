'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { computeHeaderNavTint, mixNavRgb } from './about/shared/scrollModel';
import styles from './Header.module.css';

const Header = () => {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [aboutT, setAboutT] = useState(0);

  useEffect(() => {
    // About は常に白背景 → 文字色は暗め固定（scroll 監視は Home のみ）
    if (pathname === '/about') {
      setAboutT(1);
      return;
    }

    if (pathname !== '/') {
      setAboutT(0);
      return;
    }

    const headerEl = headerRef.current;
    if (!headerEl) return;

    let raf = 0;
    const tick = () => setAboutT(computeHeaderNavTint(headerEl));
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
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
  }, [pathname]);

  const navStyle = useMemo(
    (): CSSProperties => ({ color: mixNavRgb(aboutT) }),
    [aboutT],
  );

  const onHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      ref={headerRef}
      className="fixed z-50 bg-transparent shadow-none top-4 left-4 right-4 w-auto sm:top-[50px] sm:left-[100px] sm:right-auto sm:w-[calc(100%-200px)]"
    >
      <nav className={`w-full px-0 py-3 sm:py-4 ${styles.nav}`} style={navStyle}>
        <h1 className={`text-2xl font-bold sm:text-3xl ${styles.title}`}>Kousei Tomita</h1>
        <ul className={`${styles.links} ${styles.linksResponsive}`}>
          <li>
            <Link href="/" onClick={onHomeClick}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/#works" prefetch={false}>
              Works
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
