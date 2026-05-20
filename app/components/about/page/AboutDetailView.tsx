import Link from 'next/link';
import AboutPageBridge from './AboutPageBridge';
import AboutPageJourney from './AboutPageJourney';
import AboutPageProfile from './AboutPageProfile';
import styles from './styles/AboutDetailView.module.css';

export default function AboutDetailView() {
  return (
    <div className={styles.page}>
      <AboutPageProfile />
      <AboutPageBridge />
      <AboutPageJourney />

      <div className={styles.backSection}>
        <Link href="/" className={styles.backLink}>
          ← トップへ戻る
        </Link>
      </div>
    </div>
  );
}
