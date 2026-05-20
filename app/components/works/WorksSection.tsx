import Image from 'next/image';
import styles from './WorksSection.module.css';

type Work = {
  title: string;
  period: string;
  role: string;
  description: string;
  url: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
};

const works: Work[] = [
  {
    title: 'TANKORE',
    period: '2025',
    role: 'Webapp / Backend / Frontend',
    description:
      '英単語帳とSNSを組み合わせたWebアプリ。単語カードを作成・公開し、他ユーザーの帳を見て学べます。',
    url: 'https://github.com/kousei2071/my-django',
    tags: ['Python', 'Django', 'Study'],
    image: '/works/tankore.png',
    imageAlt: 'TANKORE — 英単語帳 × SNS のプロモーション画像',
  },
  {
    title: 'STRIDE',
    period: '2026',
    role: 'Team Dev / Mobile',
    description:
      '運動特化型SNSアプリ。距離・時間・消費カロリーなどを記録し、グローバルとフォロー中のフィードで共有できる。',
    url: 'https://github.com/Tech-Jam-KDG-2026-Winter/Team-5-React-Frontend',
    tags: ['React', 'Django', 'Tech Jam'],
    image: '/works/stride.png',
    imageAlt: 'STRIDE — 運動特化型SNSアプリのプロモーション画像',
  },
  {
    title: 'Fream',
    period: '2025',
    role: 'Concept / Visual',
    description:
      '「みんなで数遊び」をテーマにした企画。楽しく数字に触れられる体験を、キャラクターと明るいビジュアルで表現。',
    url: 'https://ito-game-client.vercel.app/#',
    tags: ['React', 'Node.js', 'Game'],
    image: '/works/fream.png',
    imageAlt: 'Fream — みんなで数遊び のキービジュアル',
  },
];

export default function WorksSection() {
  return (
    <section id="works" className={styles.section} aria-labelledby="works-title">
      <h2 id="works-title" className={styles.leftTitle}>
        WORKS
      </h2>
      <p className={styles.rightTitle} aria-hidden="true">
        WORKS
      </p>
      <div className={styles.inner}>
        <div className={styles.headingBlock}>
          <p className={styles.eyebrow}>My Web Archive</p>
          <p className={styles.lead}>
            これまで作ってきたWebサイトを、役割・使用技術・URLと一緒に残していくカード一覧です。
          </p>
        </div>
        <div className={styles.grid} aria-label="制作したWebサイト一覧">
          {works.map((work, index) => (
            <article className={styles.card} key={work.title}>
              <div className={styles.cardTop}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.period}>{work.period}</span>
              </div>
              <div
                className={`${styles.preview} ${work.image ? styles.previewImage : ''}`}
                aria-hidden={work.image ? undefined : true}
              >
                {work.image ? (
                  <>
                    <div className={styles.previewChrome} aria-hidden>
                      <span className={styles.previewDot} />
                      <span className={styles.previewDot} />
                      <span className={styles.previewDot} />
                    </div>
                    <div className={styles.previewViewport}>
                      <Image
                        src={work.image}
                        alt={work.imageAlt ?? work.title}
                        fill
                        sizes="(max-width: 960px) 100vw, 33vw"
                        className={styles.previewImg}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <span />
                    <span />
                    <span />
                    <div className={styles.previewWindow}>
                      <div className={styles.previewTitle}>{work.title}</div>
                      <div className={styles.previewLine} />
                      <div className={styles.previewLineShort} />
                    </div>
                  </>
                )}
              </div>
              <div className={styles.cardBody}>
                <p className={styles.role}>{work.role}</p>
                <h3 className={styles.cardTitle}>{work.title}</h3>
                <p className={styles.description}>{work.description}</p>
                <ul className={styles.tags} aria-label={`${work.title}の使用技術`}>
                  {work.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <p className={styles.url}>{work.url}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
