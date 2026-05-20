/**
 * トップページ「これまでの道」タイムライン（home/content/）
 *
 * /about の「経歴」は page/career/content/careerMilestones.ts — 別データです。
 *
 * - 追加: 配列にオブジェクトを足す（id は英数字・ハイフン、重複しないこと）
 * - 削除: 該当オブジェクトを削除
 * - 並び: 配列の順が表示順（上 → 下）
 */

export type PathMilestone = {
  id: string;
  period: string;
  title: string;
  description: string;
};

export const pathMilestones: PathMilestone[] = [
  {
    id: 'path-start',
    period: '2025.03 – ',
    title: '大沼中学校卒業',
    description: '大沼中学校を卒業し、高校に進学する',
  },
  {
    id: 'path-team',
    period: '2024.01 – 2025.03',
    title: 'プログラミングに興味を持つ',
    description: 'ノーコードプログラミングから始まり、プログラミングの基礎を学ぶ',
  },
  {
    id: 'path-portfolio',
    period: '2025.04 – ',
    title: 'KADOKAWAドワンゴ情報工科学院入学',
    description: 'KADOKAWAドワンゴ情報工科学院に入学し、エンジニアを専攻する',
  },
];
