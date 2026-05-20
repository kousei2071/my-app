import { journeyMilestones } from '../shared/journeyMilestones';
import styles from './styles/AboutPageJourney.module.css';

export default function AboutPageJourney() {
  return (
    <section id="career" className={styles.section} aria-labelledby="career-title">
      <div className={styles.inner}>
        <h2 id="career-title" className={styles.heading}>
          <span className={styles.headingEyebrow} lang="en">
            Career
          </span>
          <span className={styles.headingMain}>経歴</span>
        </h2>

        <div className={styles.timelineWrap}>
          <ol className={styles.timeline}>
            {journeyMilestones.map((m, i) => (
              <li key={m.id} className={styles.event}>
                <div className={styles.marker} aria-hidden="true">
                  <span className={styles.dot} />
                  {i < journeyMilestones.length - 1 && <span className={styles.connector} />}
                </div>
                <article id={`journey-${m.id}`} className={styles.card}>
                  <span className={styles.index} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className={styles.period}>{m.period}</p>
                  <h3 className={styles.cardTitle}>{m.title}</h3>
                  <p className={styles.cardBody}>{m.description}</p>
                  <p className={styles.cardDetail}>{m.detail}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
