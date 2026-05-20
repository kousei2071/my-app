/**
 * About まわりのエントリ
 *
 * - hero/ … トップのヒーロー（About とは別）
 * - home/ … トップページの About + 経歴（スクロール演出）
 * - page/ … /about 詳細ページ
 * - shared/ … データ・スクロール数式（Header も利用）
 */

export { HeroSection } from '../hero';
export { AboutScrollStage, AboutJourneyRow } from './home';
export { AboutDetailView } from './page';
export {
  ABOUT_TWO_COL_MIN_WIDTH_PX,
  computeAboutScrollMotion,
  computeHeaderNavTint,
  mixNavRgb,
} from './shared/scrollModel';
export type { AboutScrollMotion } from './shared/scrollModel';
