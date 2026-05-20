'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * App Router のクライアント遷移後も、URL ハッシュに応じて該当要素へスクロールする。
 */
export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = decodeURIComponent(hash.slice(1));
      if (!id) return;
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    run();
    window.addEventListener('hashchange', run);
    return () => window.removeEventListener('hashchange', run);
  }, [pathname]);

  return null;
}
