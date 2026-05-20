export type Work = {
  title: string;
  period: string;
  role: string;
  description: string;
  summary: string;
  repositoryUrl: string;
  demoUrl?: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
};

export const works: Work[] = [
  {
    title: 'TANKORE',
    period: '2025',
    role: 'Webapp / Backend / Frontend',
    summary: '英単語帳とSNSを組み合わせたWebアプリ。',
    description:
      '英単語帳とSNSを組み合わせたWebアプリ。単語カードを作成・公開し、他ユーザーの帳を見て学べます。',
    repositoryUrl: 'https://github.com/kousei2071/my-django',
    tags: ['Python', 'Django', 'Study'],
    image: '/works/tankore.webp',
    imageAlt: 'TANKORE — 英単語帳 × SNS のプロモーション画像',
  },
  {
    title: 'STRIDE',
    period: '2026',
    role: 'Team Dev / Mobile',
    summary: '運動特化型SNS。記録とフィードで共有。',
    description:
      '運動特化型SNSアプリ。距離・時間・消費カロリーなどを記録し、グローバルとフォロー中のフィードで共有できる。',
    repositoryUrl: 'https://github.com/Tech-Jam-KDG-2026-Winter/Team-5-React-Frontend',
    tags: ['React', 'Django', 'Tech Jam'],
    image: '/works/stride.webp',
    imageAlt: 'STRIDE — 運動特化型SNSアプリのプロモーション画像',
  },
  {
    title: 'Fream',
    period: '2025',
    role: 'Concept / Visual',
    summary: '「みんなで数遊び」をテーマにした企画。',
    description:
      '「みんなで数遊び」をテーマにした企画。楽しく数字に触れられる体験を、キャラクターと明るいビジュアルで表現。',
    demoUrl: 'https://ito-game-client.vercel.app/',
    repositoryUrl: 'https://github.com/kousei2071/ito-game',
    tags: ['React', 'Node.js', 'Game'],
    image: '/works/fream.webp',
    imageAlt: 'Fream — みんなで数遊び のキービジュアル',
  },
];
