import { credentials } from './credentialsContent';
import { philosophyContent } from './philosophyContent';
import styles from './styles/AboutPageJourney.module.css';

/** 経歴章の下半分 — 理念と資格をセットで表示 */
export default function AboutPageCareerValues() {
  const hasCredentials = credentials.length > 0;

  return (
    <div className={styles.valuesSet} role="group" aria-label="理念と資格">
      <div className={styles.valuesGrid}>
        <div id="philosophy" className={`${styles.valuesBlock} ${styles.philosophyBlock}`}>
          <h3 id="philosophy-title" className={styles.valuesHeading}>
            <span className={styles.valuesHeadingEyebrow} lang="en">
              Philosophy
            </span>
            <span className={styles.valuesHeadingMain}>理念</span>
          </h3>
          {philosophyContent.lead ? (
            <p className={styles.valuesLead}>{philosophyContent.lead}</p>
          ) : null}
          <ul className={styles.principleList}>
            {philosophyContent.items.map((item) => (
              <li key={item.id}>
                <article className={styles.principleCard}>
                  <h4 className={styles.principleTitle}>{item.title}</h4>
                  <p className={styles.principleBody}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <div id="credentials" className={styles.valuesBlock}>
          <h3 id="credentials-title" className={styles.valuesHeading}>
            <span className={styles.valuesHeadingEyebrow} lang="en">
              Credentials
            </span>
            <span className={styles.valuesHeadingMain}>資格</span>
          </h3>
          {hasCredentials ? (
            <ul className={styles.credentialList}>
              {credentials.map((c) => {
                const meta = [c.date, c.issuer].filter(Boolean).join(' · ');
                return (
                  <li key={c.id} className={styles.credentialItem}>
                    <p className={styles.credentialName}>{c.name}</p>
                    {meta ? <p className={styles.credentialMeta}>{meta}</p> : null}
                    {c.note ? <p className={styles.credentialNote}>{c.note}</p> : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.credentialEmpty}>
              credentialsContent.ts に資格を追加すると、ここに表示されます。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
