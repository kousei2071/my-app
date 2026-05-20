import AboutPageBridge from './AboutPageBridge';
import AboutPageJourney from './AboutPageJourney';
import AboutPageProfile from './AboutPageProfile';
import styles from './styles/AboutDetailView.module.css';

export default function AboutDetailView() {
  return (
    <div className={styles.page}>
      {/* 第1章: About（プロフィール） */}
      <AboutPageProfile />
      <AboutPageBridge />
      {/* 第2章: 経歴 + 理念・資格 */}
      <AboutPageJourney />
    </div>
  );
}
