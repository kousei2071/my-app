/** スキル名と習熟度（0〜100）。ここだけ編集すれば表示が変わります。 */
export type SkillItem = {
  name: string;
  level: number;
};

export type SkillGroup = {
  title: string;
  description: string;
  skills: SkillItem[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    description: 'Webページの構造、見た目、動きを組み立てるための基本技術です。',
    skills: [
      { name: 'React.js', level: 60 },
      { name: 'Next.js', level: 60 },
      { name: 'JavaScript', level: 45 },
      { name: 'HTML', level: 40 },
      { name: 'CSS', level: 40 },
    ],
  },
  {
    title: 'Framework',
    description: 'コンポーネント単位でUIを分け、ページ全体を管理しやすくします。',
    skills: [
      { name: 'React', level: 60 },
      { name: 'Next.js', level: 55 },
      { name: 'TypeScript', level: 50 },
    ],
  },
  {
    title: 'Styling',
    description: '画面幅に合わせたレイアウトや、スクロールに合わせた演出を作ります。',
    skills: [
      { name: 'CSS Modules', level: 55 },
      { name: 'Responsive Design', level: 50 },
      { name: 'Animation', level: 40 },
    ],
  },
  {
    title: 'Tools',
    description: '開発、デザイン確認、変更管理に使っているツールです。',
    skills: [
      { name: 'Git', level: 50 },
      { name: 'GitHub', level: 50 },
      { name: 'VS Code', level: 70 },
      { name: 'Figma', level: 45 },
    ],
  },
];
