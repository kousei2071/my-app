/**
 * About スクロールの「数値だけ」の層。
 * - 定数（調整はここ）
 * - 補間
 * - progress → レイアウト + ABOUT タイトル
 * - ヘッダー色用（DOM 重なり）
 */

// ----- 定数（チューニングはこのブロックだけ見ればよい） -----

/** 2 カラム＋スクロール演出のブレークポイント */
export const ABOUT_TWO_COL_MIN_WIDTH_PX = 900;

/** ステージの縦長（vh） */
export const ABOUT_STAGE_MIN_HEIGHT_VH = 155;

/** グリッドが広がり切る progress */
export const LAYOUT_END = 0.38;
export const WIDE_COL_FR = 2.5;
export const WRAP_WIDTH_START_REM = 72;
export const WRAP_WIDTH_END_REM = 100;

/** ABOUT タイトル */
export const TITLE_HIDDEN_UNTIL = 0.05;
export const TITLE_REVEAL_END = 0.3;
/** 出現の水平オフセット（px） */
export const TITLE_SLIDE_OFFSET_PX = 20;
export const TITLE_SLIDE_START_VW = -14;
export const TITLE_SLIDE_HIDDEN_VW = -16;
export const TITLE_SCALE_START = 0.92;

/** transform-origin の縦線補正（CSS 変数と同期） */
export const TITLE_ORIGIN_SHIFT_PX = 20;

// ----- 補間 -----

export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

export function segment(p: number, a: number, b: number): number {
  if (p <= a) return 0;
  if (p >= b) return 1;
  return (p - a) / (b - a);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep01(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function easeSegment(p: number, a: number, b: number): number {
  return smoothstep01(segment(p, a, b));
}

// ----- progress → レイアウト + ABOUT -----

export type AboutScrollMotion = {
  gridLeftFr: number;
  gridRightFr: number;
  wrapMaxWidthRem: number;
  titleTransform: string;
  titleOpacity: number;
};

function titleTranslate(vw: number, px: number, scale: number): string {
  if (px === 0) {
    return `translate3d(${vw}vw, 0, 0) scale(${scale})`;
  }
  return `translate3d(calc(${vw}vw + ${px}px), 0, 0) scale(${scale})`;
}

export function computeAboutScrollMotion(p: number): AboutScrollMotion {
  const pClamped = clamp01(p);
  const tLayout = easeSegment(pClamped, 0, LAYOUT_END);
  const tReveal = easeSegment(pClamped, TITLE_HIDDEN_UNTIL, TITLE_REVEAL_END);

  const gridLeftFr = lerp(1.05, WIDE_COL_FR, tLayout);
  const gridRightFr = lerp(0.95, WIDE_COL_FR, tLayout);
  const wrapMaxWidthRem = lerp(WRAP_WIDTH_START_REM, WRAP_WIDTH_END_REM, tLayout);

  if (pClamped < TITLE_HIDDEN_UNTIL) {
    return {
      gridLeftFr,
      gridRightFr,
      wrapMaxWidthRem,
      titleOpacity: 0,
      titleTransform: titleTranslate(
        TITLE_SLIDE_HIDDEN_VW,
        TITLE_SLIDE_OFFSET_PX,
        TITLE_SCALE_START,
      ),
    };
  }

  if (pClamped < TITLE_REVEAL_END) {
    const txVw = lerp(TITLE_SLIDE_START_VW, 0, tReveal);
    const txPx = Math.round(lerp(TITLE_SLIDE_OFFSET_PX, 0, tReveal));
    const sc = lerp(TITLE_SCALE_START, 1, tReveal);
    return {
      gridLeftFr,
      gridRightFr,
      wrapMaxWidthRem,
      titleOpacity: tReveal,
      titleTransform: titleTranslate(txVw, txPx, sc),
    };
  }

  return {
    gridLeftFr,
    gridRightFr,
    wrapMaxWidthRem,
    titleOpacity: 1,
    titleTransform: titleTranslate(0, 0, 1),
  };
}

// ----- ヘッダー（About 白帯との重なり） -----

export function mixNavRgb(t: number): string {
  const x = clamp01(t);
  const c = Math.round(255 + (23 - 255) * x);
  return `rgb(${c} ${c} ${c})`;
}

function overlapTint(headerEl: HTMLElement, target: Element): number {
  const h = headerEl.getBoundingClientRect();
  const a = target.getBoundingClientRect();

  if (h.height <= 0) return 0;
  if (a.top >= h.bottom) return 0;
  if (a.bottom <= h.top) return 1;

  const overlap = Math.min(h.bottom, a.bottom) - Math.max(h.top, a.top);
  if (overlap <= 0) return 0;
  const raw = overlap / h.height;
  return clamp01((raw - 0.1) / (0.78 - 0.1));
}

export function computeHeaderNavTint(headerEl: HTMLElement): number {
  const lightBackgroundTargets = [
    document.getElementById('about-scroll-hit') ?? document.getElementById('about'),
    document.getElementById('works'),
  ].filter((target): target is HTMLElement => target !== null);

  if (lightBackgroundTargets.length === 0) return 0;

  return Math.max(...lightBackgroundTargets.map((target) => overlapTint(headerEl, target)));
}
