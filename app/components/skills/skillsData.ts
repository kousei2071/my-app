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
      { name: 'React', level: 50 },
      { name: 'Next.js', level: 40 },
      { name: 'JavaScript', level: 55 },
      { name: 'HTML', level: 50 },
      { name: 'CSS', level: 50 },
    ],
  },
  {
    title: 'Backend',
    description: 'コンポーネント単位でUIを分け、ページ全体を管理しやすくします。',
    skills: [
      { name: 'python', level: 60 },
      { name: 'Java', level: 2 },
      { name: 'Node.js', level: 10 },
    ],
  },
  {
    title: 'Other',
    description: 'その他のデザインや、技術に関する基本知識です。',
    skills: [
      { name: 'Adobi Photoshop', level: 35 },
      { name: 'figman', level: 30 },
      { name: 'VS Code', level: 60 },
      { name: 'AI', level: 60 },
    ],
  },
  {
    title: 'Tool',
    description: '開発、デザイン確認、変更管理に使っているツールやサービスです。',
    skills: [
      { name: 'Git', level: 50 },
      { name: 'GitHub', level: 50 },
      { name: 'AWS', level: 50 },
      { name: 'Figma', level: 20 },
    ],
  },
];
