'use client';

import { useEffect, useState } from 'react';
import LifeJourneySection from '../LifeJourneySection';
import AboutSection from './AboutSection';
import { useAboutScroll } from './AboutScrollStage';
import { ABOUT_TWO_COL_MIN_WIDTH_PX } from './scrollModel';
import styles from './styles/AboutJourneyRow.module.css';

type AboutJourneyRowProps = {
  nameJa: string;
  nameEn: string;
};

export default function AboutJourneyRow({ nameJa, nameEn }: AboutJourneyRowProps) {
  const scroll = useAboutScroll();
  const [twoCol, setTwoCol] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${ABOUT_TWO_COL_MIN_WIDTH_PX}px)`);
    const apply = () => setTwoCol(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const motion = scroll?.motion;
  const wrapStyle =
    motion && twoCol
      ? {
          gridTemplateColumns: `minmax(0, ${motion.gridLeftFr}fr) minmax(0, ${motion.gridRightFr}fr)`,
          maxWidth: `${motion.wrapMaxWidthRem}rem`,
        }
      : undefined;

  return (
    <div className={styles.bleed}>
      <div className={styles.wrap} style={wrapStyle}>
        <AboutSection nameJa={nameJa} nameEn={nameEn} />
        <LifeJourneySection pairLayout />
      </div>
    </div>
  );
}
