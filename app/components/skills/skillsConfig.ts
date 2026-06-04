export type View = 'stack' | 'skills';
export type Phase = 'idle' | 'burst' | 'reveal';

/** 見た目を保ちつつ DOM / アニメ負荷を抑える */
export const N_PARTICLES = 48;
export const BURST_S = 1;
export const REVEAL_S = 0.42;
/** Stack → Skills のときだけ視点を少し下へ（px） */
export const SCROLL_SKILLS = 72;

export const EASE = [0.22, 1, 0.36, 1] as const;

export const siteStack = [
  {
    name: 'Next.js 16.2.4',
    description: 'ページとセクションをコンポーネント単位で分けて構成しています。',
  },
  {
    name: 'React 19.2.4',
    description: 'コンポーネント単位でUIを分け、ページ全体を管理しやすくします。',
  },
  {
    name: 'TypeScript 5',
    description: '型をつけて、変更しやすいコードにしています。',
  },
  {
    name: 'EmailJS',
    description: 'メール送信機能を実装しています。',
  },
  {
    name: 'framer-motion',
    description: '細かいアニメーションから大きなアニメーションまでを作ります。',
  },
] as const;

export const viewMeta = {
  stack: {
    lead: 'このポートフォリオを構成している技術です。',
    cardLabel: 'This Site Stack',
    viewBadge: 'Site',
  },
  skills: {
    lead: 'これまで学習・制作で使ってきた技術です。',
    cardLabel: 'Core Skills',
    viewBadge: 'Skills',
  },
} as const;
