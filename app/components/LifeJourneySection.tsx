import styles from './LifeJourneySection.module.css';

type Milestone = {
  id: string;
  period: string;
  title: string;
  description: string;
};

const milestones: Milestone[] = [
  {
    id: 'hs',
    period: '2019.04 – 2022.03',
    title: '〇〇高等学校',
    description: '理系コース。プログラミングへの興味が芽生える。',
  },
  {
    id: 'uni',
    period: '2022.04 – 現在',
    title: '〇〇大学',
    description: '情報工学を専攻。Web アプリケーション開発を中心に学んでいます。',
  },
  {
    id: 'portfolio',
    period: '2025',
    title: 'ポートフォリオサイト',
    description: 'Next.js で設計から実装まで。自分の軸をまとめる。',
  },
];

type LifeJourneySectionProps = {
  /** About と横並びにするとき true */
  pairLayout?: boolean;
};

export default function LifeJourneySection({ pairLayout = false }: LifeJourneySectionProps) {
  return (
    <section
      id="journey"
      className={pairLayout ? styles.sectionPair : styles.section}
      aria-labelledby="journey-heading"
    >
      <div className={pairLayout ? styles.innerPair : styles.inner}>
        <h2 id="journey-heading" className={styles.heading}>
          <span className={styles.headingEyebrow} lang="en">
            Path
          </span>
          <span className={styles.headingMain}>これまでの道</span>
        </h2>

        <ol className={styles.timeline}>
          {milestones.map((m, i) => (
            <li key={m.id} className={styles.event}>
              <div className={styles.spine} aria-hidden="true">
                <span className={styles.dot} />
                <span className={styles.branch} />
              </div>
              <article className={styles.card}>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className={styles.period}>{m.period}</p>
                <h3 className={styles.cardTitle}>{m.title}</h3>
                <p className={styles.cardBody}>{m.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
