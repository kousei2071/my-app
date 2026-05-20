/**
 * 第2章「経歴」内の理念（career/content/ — このファイルだけ編集）
 */

export type PhilosophyItem = {
  id: string;
  title: string;
  body: string;
};

export const philosophyContent = {
  /** 見出し下のリード（空文字なら非表示） */
  lead: '技術選定と体験設計の両面で、次のことを大切にしています。',
  items: [
    {
      id: 'selection',
      title: '一貫性を重視する',
      body:
        'デザインから実装、フロントからバックまで一貫性のある設計を心がけ、将来の自分とチームのための記録にもなるようにする。',
    },
    {
      id: 'ux',
      title: 'ユーザーの利便性を考える',
      body:
        '見た目だけでなく、操作の迷い・待ち時間・フィードバックまで含めて体験を整える。ユーザーが目的に最短で届く導線を意識する。',
    },
  ] satisfies PhilosophyItem[],
};
