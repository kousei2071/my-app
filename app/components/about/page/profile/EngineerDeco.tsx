'use client';

import { useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getEngineerTenure } from './content/engineerTenure';
import { PROFILE_META } from './content/profileMeta';
import styles from './profile.module.css';

export default function EngineerDeco() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const tenure = useMemo(
    () => getEngineerTenure(PROFILE_META.engineerSince),
    [],
  );

  const showTenure = reduceMotion || active;

  return (
    <div className={styles.engineerDeco}>
      <button
        type="button"
        className={`${styles.engineerPanel} ${reduceMotion ? styles.engineerPanelStatic : ''}`}
        aria-label={`エンジニア歴 ${tenure.years}年${tenure.days}日。ホバーで詳細を表示`}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        <span className={styles.engineerPrompt} aria-hidden={showTenure}>
          <span className={styles.engineerPrefix}>$</span> uptime --dev
          {!reduceMotion && <span className={styles.engineerCursor}>_</span>}
        </span>
        <span
          className={`${styles.engineerTenure} ${showTenure ? styles.engineerTenureVisible : ''}`}
          aria-hidden={!showTenure}
        >
          <span className={styles.engineerTenureMain}>
            エンジニア歴 {tenure.years}年 {tenure.days}日
          </span>
          <span className={styles.engineerTenureSub}>since {PROFILE_META.engineerSince}</span>
        </span>
      </button>
    </div>
  );
}
