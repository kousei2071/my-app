/** ページ本体（Header + 各セクション）。モーダル中は inert で操作不可にする */
export const PAGE_ROOT_ID = 'page-root';

/** body 直下のオーバーレイ。Works の isolation より上に載せる */
export const MODAL_Z_INDEX = 1000;

/** モーダル内だけスクロール可能にするルート（lockBodyScroll が参照） */
export const MODAL_SCROLL_ROOT_ATTR = 'data-modal-scroll-root';
