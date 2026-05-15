'use client';

import { useEffect, useMemo, useState } from 'react';
import AboutSection from './AboutSection';
import LifeJourneySection from './LifeJourneySection';
import { computeAboutScrollMotion } from './aboutScrollMath';
import { useAboutScrollStage } from './AboutScrollContext';
import styles from './AboutJourneyRow.module.css';

type AboutJourneyRowProps = {
  nameJa: string;
  nameEn: string;
};

export default function AboutJourneyRow({ nameJa, nameEn }: AboutJourneyRowProps) {
  const stage = useAboutScrollStage();
  const motion = useMemo(
    () => (stage ? computeAboutScrollMotion(stage.progress) : null),
    [stage?.progress],
  );

  const [twoCol, setTwoCol] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const apply = () => setTwoCol(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

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
        <AboutSection nameJa={nameJa} nameEn={nameEn} pairLayout />
        <LifeJourneySection pairLayout />
      </div>
    </div>
  );
}
