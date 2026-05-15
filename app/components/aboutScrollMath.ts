/**
 * About スクロール演出用の純関数。
 * 進捗 p（0 = ステージ開始付近、1 = ステージ終端）からレイアウトと ABOUT の見え方を求める。
 *
 * 方針: p=0 から一貫したタイムライン（見出しが長く消えない・レイアウトとタイトルは同じ帯で進む）。
 */

/** 0〜1 に収める */
export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/**
 * p が区間 [a, b] をどれだけ進んだかを 0〜1 で返す。
 * p < a → 0、p > b → 1。
 */
export function segment(p: number, a: number, b: number): number {
  if (p <= a) return 0;
  if (p >= b) return 1;
  return (p - a) / (b - a);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 端で滑らかになる補間（3次エルミート） */
export function smoothstep01(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

/** フェーズ境界をまたぐときに segment の結果を smoothstep する */
export function easeSegment(p: number, a: number, b: number): number {
  return smoothstep01(segment(p, a, b));
}

export type AboutScrollMotion = {
  /** CSS grid-template-columns 用（fr 係数） */
  gridLeftFr: number;
  gridRightFr: number;
  /** .wrap の max-width（rem） */
  wrapMaxWidthRem: number;
  /** ABOUT 用 transform（translate / scale を文字列で） */
  titleTransform: string;
  titleOpacity: number;
  /** スクロール連動の縦シフトは使わない（常に 0） */
  nameBlockTranslateYRem: number;
};

/** 広がり終了時のカラム係数 */
const WIDE_COL_FR = 2.5;

/** グリッド・max-width が広がり切るまで */
const LAYOUT_END = 0.38;
/** ABOUT のフェード 0→1 */
const TITLE_FADE_END = 0.14;
/** ABOUT の左からのスライド完了 */
const TITLE_SLIDE_END = 0.36;

export function computeAboutScrollMotion(p: number): AboutScrollMotion {
  const pClamped = clamp01(p);

  const tLayout = easeSegment(pClamped, 0, LAYOUT_END);
  const tSlide = easeSegment(pClamped, 0, TITLE_SLIDE_END);
  const tFade = easeSegment(pClamped, 0, TITLE_FADE_END);
  const tScale = easeSegment(pClamped, 0, 0.22);

  const gridLeftFr = lerp(1.05, WIDE_COL_FR, tLayout);
  const gridRightFr = lerp(0.95, WIDE_COL_FR, tLayout);
  const wrapMaxWidthRem = lerp(72, 100, tLayout);

  const titleOpacity = lerp(0.28, 1, tFade);
  const txVw = lerp(-14, 0, tSlide);
  const sc = lerp(0.94, 1, tScale);
  const titleTransform = `translateX(${txVw}vw) scale(${sc})`;

  return {
    gridLeftFr,
    gridRightFr,
    wrapMaxWidthRem,
    titleTransform,
    titleOpacity,
    nameBlockTranslateYRem: 0,
  };
}
