'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { useAboutScroll } from './AboutScrollStage';
import { TITLE_ORIGIN_SHIFT_PX, type AboutScrollMotion } from '../shared/scrollModel';
import styles from './styles/AboutSection.module.css';

type AboutSectionProps = {
  nameJa: string;
  nameEn: string;
  motion?: AboutScrollMotion | null;
};

export default function AboutSection({ nameJa, nameEn, motion: motionProp }: AboutSectionProps) {
  const scroll = useAboutScroll();
  const motion = scroll?.motion ?? motionProp ?? null;
  const scrollDriven = motion !== null;

  const titleStyle: CSSProperties | undefined = motion
    ? {
        transform: motion.titleTransform,
        opacity: motion.titleOpacity,
        ['--about-title-origin-shift' as string]: `${TITLE_ORIGIN_SHIFT_PX}px`,
      }
    : undefined;

  return (
    <section
      id="about"
      className={styles.sectionPair}
      aria-labelledby="about-title about-profile-name"
    >
      <div className={styles.containerPair}>
        <div className={`${styles.message} ${styles.messagePair}`}>
          <h2 id="about-title" className={styles.heading}>
            <span
              className={scrollDriven ? `${styles.title} ${styles.titleScroll}` : styles.title}
              lang="en"
              style={titleStyle}
            >
              ABOUT
            </span>
          </h2>
          <div className={styles.nameBlock}>
            <p id="about-profile-name" className={styles.nameJa} lang="ja">
              {nameJa}
            </p>
            <p className={styles.nameEn} lang="en">
              {nameEn}
            </p>
            <p className={styles.lead}>
              Webアプリケーションを中心に開発しています。
            </p>
            <p className={styles.body}>
              開発において、単に機能を実装するだけでなく、なぜその技術スタックを選んだのかという『選定理由』を大切にしています。また、ユーザーの利便性を考えて、UI/UXを最適化しています。
            </p>
            <Link href="/about" className={styles.moreRead} aria-label="About 詳細ページへ">
              More Read
              <span className={styles.moreReadArrow} aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
