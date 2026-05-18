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
    period: ' – 2025.03',
    title: '大沼中学校',
    description: '中学校を卒業',
  },
  {
    id: 'uni',
    period: '2024.04 – 現在',
    title: 'プログラミングを始める',
    description: 'プログラミングへの興味が芽生え、スクールでプログラミングを学ぶ。',
  },
  {
    id: 'portfolio',
    period: '2025.04 – ',
    title: 'KADOKAWAドワンゴ情報工科学院入学',
    description: 'エンジニアを専攻。Webアプリケーション開発を中心に学ぶ。',
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
