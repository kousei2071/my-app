/**
 * About ブロックの公開 API
 *
 * - scrollModel … 定数・数式・ヘッダー色用（純 TS）
 * - styles/ … CSS Modules（コンポーネントごと）
 * - AboutScrollStage … スクロール計測 + Context
 * - HeroSection / AboutJourneyRow / AboutSection … UI
 */

export {
  ABOUT_STAGE_MIN_HEIGHT_VH,
  ABOUT_TWO_COL_MIN_WIDTH_PX,
  computeAboutScrollMotion,
  computeHeaderNavTint,
  mixNavRgb,
} from './scrollModel';
export type { AboutScrollMotion } from './scrollModel';

export { default as AboutScrollStage, useAboutScroll } from './AboutScrollStage';
export type { AboutScrollValue } from './AboutScrollStage';

export { default as HeroSection } from './HeroSection';
export { default as AboutJourneyRow } from './AboutJourneyRow';
export { default as AboutSection } from './AboutSection';
