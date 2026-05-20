/**
 * /about「経歴」セクションの内容
 *
 * このファイルだけ編集すれば表示が変わります。
 * - 追加: 配列にオブジェクトを足す（id は英数字・ハイフン、ページ内で重複しないこと）
 * - 削除: 該当オブジェクトを削除
 * - 並び: 配列の順が上から古い → 新しい（タイムラインの表示順）
 */

export type CareerMilestone = {
  /** アンカー用 ID（例: journey-hs → #journey-hs） */
  id: string;
  /** 期間表示（例: 2024.04 – 現在） */
  period: string;
  /** 見出し */
  title: string;
  /** カード内の短い説明 */
  description: string;
  /** 補足（空文字なら非表示） */
  detail: string;
};

export const careerMilestones: CareerMilestone[] = [
  {
    id: 'hs',
    period: ' – 2025.03',
    title: '個人開発',
    description: '個人開発を始める',
    detail:
      'フロントからバックまで、自分でWebアプリケーションを作成',
  },
  {
    id: 'uni',
    period: '2026.01 – 2026.02',
    title: 'チーム開発',
    description: 'チーム開発で経験を積む',
    detail:
      'チームでWebアプリケーションを作成し、チーム開発の経験を積む',
  },
  {
    id: 'portfolio',
    period: '2025.04 – ',
    title: 'ポートフォリオ作成',
    description: 'ポートフォリオを作成する',
    detail:
      'ポートフォリオを作成し、自分の技術を展示する',
  },
];
