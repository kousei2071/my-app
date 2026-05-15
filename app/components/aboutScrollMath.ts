/**
 * About スクロール演出用の純関数。
 * 進捗 p（0 = スクロール開始直後、1 = ステージ終端）から、
 * グリッド比率・ABOUT の transform・名前ブロックの位置などを求める。
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
  /** .wrap の max-width（rem）。フェーズ1で広げたあと維持 */
  wrapMaxWidthRem: number;
  /** ABOUT 用 transform（translate / scale を文字列で） */
  titleTransform: string;
  titleOpacity: number;
  /** 名前〜本文（スクロール連動の translateY は使わず常に 0） */
  nameBlockTranslateYRem: number;
  /** フェーズ1で ABOUT を切らず見せる */
  messageOverflowX: 'visible' | 'clip';
};

/** フェーズ1終了時・フェーズ2中の「広い」カラム係数（左右同じ） */
const WIDE_COL_FR = 2.75;

/** レイアウト広がり・ABOUT 登場を始めるスクロール割合（それまでは ABOUT 非表示・レイアウト初期） */
const PHASE1_START = 0.04;

/**
 * ABOUT は左からのスライド＋フェードで登場。
 * 自己紹介ブロックの縦シフトは行わない（nameBlockTranslateYRem は常に 0）。
 */
/** ABOUT タイトル: 左から入るスライドが終わるまでの progress 上限 */
const TITLE_SLIDE_END = 0.24;
/** 不透明度が立ち上がる区間（急に出ないように PHASE1_START から短めにフェード） */
const TITLE_FADE_END = 0.1;

export function computeAboutScrollMotion(p: number): AboutScrollMotion {
  const pClamped = clamp01(p);

  const tLayout = easeSegment(pClamped, PHASE1_START, 0.22);
  const tSlide = easeSegment(pClamped, PHASE1_START, TITLE_SLIDE_END);
  const tFade = easeSegment(pClamped, PHASE1_START, TITLE_FADE_END);
  const tScale = easeSegment(pClamped, PHASE1_START, 0.18);

  // --- グリッド: PHASE1_START までは初期 → 0.22 までに WIDE ---
  let gridLeftFr = 1.05;
  let gridRightFr = 0.95;
  if (pClamped < PHASE1_START) {
    gridLeftFr = 1.05;
    gridRightFr = 0.95;
  } else if (pClamped <= 0.22) {
    gridLeftFr = lerp(1.05, WIDE_COL_FR, tLayout);
    gridRightFr = lerp(0.95, WIDE_COL_FR, tLayout);
  } else {
    gridLeftFr = WIDE_COL_FR;
    gridRightFr = WIDE_COL_FR;
  }

  let wrapMaxWidthRem = 72;
  if (pClamped < PHASE1_START) {
    wrapMaxWidthRem = 72;
  } else if (pClamped <= 0.22) {
    wrapMaxWidthRem = lerp(72, 104, tLayout);
  } else {
    wrapMaxWidthRem = 104;
  }

  // --- ABOUT: 左からスライドイン＋フェード（急な出現を防ぐ）---
  let titleTransform = '';
  let titleOpacity = 1;

  if (pClamped < PHASE1_START) {
    titleOpacity = 0;
    titleTransform = 'translateX(-32vw) scale(0.9)';
  } else if (pClamped <= TITLE_SLIDE_END) {
    titleOpacity = lerp(0, 1, tFade);
    const txVw = lerp(-30, 0, tSlide);
    const sc = lerp(0.9, 1, tScale);
    titleTransform = `translateX(${txVw}vw) scale(${sc})`;
  } else {
    titleOpacity = 1;
    titleTransform = 'translateX(0) scale(1)';
  }

  const nameBlockTranslateYRem = 0;

  const messageOverflowX: 'visible' | 'clip' =
    pClamped > 0.18 && pClamped < 0.5 ? 'visible' : 'clip';

  return {
    gridLeftFr,
    gridRightFr,
    wrapMaxWidthRem,
    titleTransform,
    titleOpacity,
    nameBlockTranslateYRem,
    messageOverflowX,
  };
}
