import Link from 'next/link';
import { journeyMilestones } from '../shared/journeyMilestones';
import AboutPageProfile from './AboutPageProfile';
import styles from './styles/AboutDetailView.module.css';

export default function AboutDetailView() {
  return (
    <div className={styles.page}>
      <AboutPageProfile />

      <section id="journey" className={styles.journeySection} aria-labelledby="detail-journey-title">
        <div className={styles.journeyInner}>
          <h2 id="detail-journey-title" className={styles.journeyHeading}>
            <span className={styles.journeyEyebrow} lang="en">
              Path
            </span>
            <span className={styles.journeyMain}>これまでの道</span>
          </h2>

          <ol className={styles.timeline}>
            {journeyMilestones.map((m, i) => (
              <li key={m.id} className={styles.event}>
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
      </section>

      <div className={styles.backSection}>
        <Link href="/" className={styles.backLink}>
          ← トップへ戻る
        </Link>
      </div>
    </div>
  );
}
