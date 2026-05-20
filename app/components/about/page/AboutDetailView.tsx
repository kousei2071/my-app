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
    </div>
  );
}
