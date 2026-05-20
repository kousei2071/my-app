export type Milestone = {
  id: string;
  period: string;
  title: string;
  description: string;
  /** 詳細 About ページ用の補足 */
  detail: string;
};

export const journeyMilestones: Milestone[] = [
  {
    id: 'hs',
    period: ' – 2025.03',
    title: '大沼中学校',
    description: '中学校を卒業',
    detail:
      '基礎学力とチームでの活動を通じて、物事を計画的に進める習慣を身につけました。',
  },
  {
    id: 'uni',
    period: '2024.04 – 現在',
    title: 'プログラミングを始める',
    description: 'プログラミングへの興味が芽生え、スクールでプログラミングを学ぶ。',
    detail:
      'Web 制作とアプリ開発の基礎を学び、UI の見え方と実装のつながりに興味を持ちました。',
  },
  {
    id: 'portfolio',
    period: '2025.04 – ',
    title: 'KADOKAWAドワンゴ情報工科学院入学',
    description: 'エンジニアを専攻。Webアプリケーション開発を中心に学ぶ。',
    detail:
      'チーム開発やハッカソンを通じて、設計・実装・レビューの一連の流れを経験しています。',
  },
];
