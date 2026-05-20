import { journeyMilestones } from './about/journeyMilestones';
import styles from './LifeJourneySection.module.css';

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
          {journeyMilestones.map((m, i) => (
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
