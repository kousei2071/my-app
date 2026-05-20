import { careerMilestones } from './content/careerMilestones';
import CareerValues from './CareerValues';
import styles from './career.module.css';

/** 第2章 — 経歴（タイムライン + 理念・資格セット） */
export default function CareerSection() {
  return (
    <section
      id="career"
      className={styles.careerChapter}
      aria-labelledby="career-title philosophy-title credentials-title"
    >
      <div className={styles.inner}>
        <h2 id="career-title" className={styles.heading}>
          <span className={styles.headingEyebrow} lang="en">
            Career
          </span>
          <span className={styles.headingMain}>経歴</span>
        </h2>

        <div className={styles.careerStack}>
          <div className={styles.timelineRegion}>
            <div className={styles.timelineWrap}>
              <ol className={styles.timeline}>
                {careerMilestones.map((m, i) => (
                  <li key={m.id} className={styles.event}>
                    <div className={styles.marker} aria-hidden="true">
                      <span className={styles.dot} />
                      {i < careerMilestones.length - 1 && (
                        <span className={styles.connector} />
                      )}
                    </div>
                    <article id={`journey-${m.id}`} className={styles.card}>
                      <span className={styles.index} aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className={styles.period}>{m.period}</p>
                      <h3 className={styles.cardTitle}>{m.title}</h3>
                      <p className={styles.cardBody}>{m.description}</p>
                      {m.detail ? <p className={styles.cardDetail}>{m.detail}</p> : null}
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <CareerValues />
        </div>
      </div>
    </section>
  );
}
