'use client';

import { useEffect } from 'react';
import { PAGE_ROOT_ID } from './constants';
import { lockBodyScroll } from './lockBodyScroll';

/**
 * モーダル表示中:
 * - html/body を固定して背景スクロール停止
 * - #page-root を inert にして操作不可
 */
export function useModalLayerLock(active: boolean) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const root = document.getElementById(PAGE_ROOT_ID);
    const unlockScroll = lockBodyScroll();

    root?.setAttribute('inert', '');
    root?.setAttribute('aria-hidden', 'true');

    return () => {
      unlockScroll();
      root?.removeAttribute('inert');
      root?.removeAttribute('aria-hidden');
    };
  }, [active]);
}
