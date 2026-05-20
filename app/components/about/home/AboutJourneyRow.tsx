import LifeJourneySection from './LifeJourneySection';
import AboutSection from './AboutSection';
import styles from './styles/AboutJourneyRow.module.css';

type AboutJourneyRowProps = {
  nameJa: string;
  nameEn: string;
};

export default function AboutJourneyRow({ nameJa, nameEn }: AboutJourneyRowProps) {
  return (
    <div className={styles.bleed}>
      <div className={`${styles.wrap} aboutJourneyWrap`}>
        <AboutSection nameJa={nameJa} nameEn={nameEn} />
        <LifeJourneySection pairLayout />
      </div>
    </div>
  );
}
