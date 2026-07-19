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
      { name: 'Java', level: 45 },
      { name: 'Node.js', level: 10 },
    ],
  },
  {
    title: 'framework',
    description: 'フレームワークに関する知識です。',
    skills: [
      { name: 'Next.js', level: 40 },
      { name: 'Django', level: 50 },
      { name: 'Spring Boot', level: 5 },
      { name: 'Flask', level: 20 },
    ],
  },
  {
    title: 'Tool',
    description: '開発、デザイン確認、変更管理に使っているツールやサービスです。',
    skills: [
      { name: 'Git', level: 50 },
      { name: 'GitHub', level: 50 },
      { name: 'AWS', level: 30 },
      { name: 'Figma', level: 20 },
    ],
  },
];
