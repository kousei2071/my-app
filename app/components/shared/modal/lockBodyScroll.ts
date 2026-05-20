import { MODAL_SCROLL_ROOT_ATTR } from './constants';

function isInsideModalScrollable(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(target.closest(`[${MODAL_SCROLL_ROOT_ATTR}]`));
}

/**
 * 背景スクロールを止める（html/body 固定 + iOS 向け position:fixed）。
 * モーダル内の data-modal-scroll-root だけホイール・タッチスクロールを許可。
 */
export function lockBodyScroll(): () => void {
  const scrollY = window.scrollY;
  const html = document.documentElement;
  const body = document.body;

  const saved = {
    htmlOverflow: html.style.overflow,
    htmlOverscrollBehavior: html.style.overscrollBehavior,
    bodyOverflow: body.style.overflow,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
    bodyPaddingRight: body.style.paddingRight,
  };

  const scrollbarWidth = window.innerWidth - html.clientWidth;

  html.classList.add('modal-open');
  html.style.overflow = 'hidden';
  html.style.overscrollBehavior = 'none';
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }

  const preventBackgroundScroll = (event: WheelEvent | TouchEvent) => {
    if (isInsideModalScrollable(event.target)) {
      return;
    }
    event.preventDefault();
  };

  document.addEventListener('wheel', preventBackgroundScroll, { passive: false });
  document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

  return () => {
    document.removeEventListener('wheel', preventBackgroundScroll);
    document.removeEventListener('touchmove', preventBackgroundScroll);

    html.classList.remove('modal-open');
    html.style.overflow = saved.htmlOverflow;
    html.style.overscrollBehavior = saved.htmlOverscrollBehavior;
    body.style.overflow = saved.bodyOverflow;
    body.style.position = saved.bodyPosition;
    body.style.top = saved.bodyTop;
    body.style.left = saved.bodyLeft;
    body.style.right = saved.bodyRight;
    body.style.width = saved.bodyWidth;
    body.style.paddingRight = saved.bodyPaddingRight;

    window.scrollTo(0, scrollY);
  };
}
