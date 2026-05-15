'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { computeAboutScrollMotion } from './aboutScrollMath';
import { useAboutScrollStage } from './AboutScrollContext';
import styles from './AboutSection.module.css';

type AboutSectionProps = {
  nameJa: string;
  nameEn: string;
  pairLayout?: boolean;
};

export default function AboutSection({
  nameJa,
  nameEn,
  pairLayout = false,
}: AboutSectionProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [titleInView, setTitleInView] = useState(false);
  const scrollStage = useAboutScrollStage();
  const scrollDriven = scrollStage !== null;

  const motion = useMemo(
    () => (scrollStage ? computeAboutScrollMotion(scrollStage.progress) : null),
    [scrollStage?.progress],
  );

  useEffect(() => {
    if (scrollDriven) return;

    const heading = headingRef.current;
    if (!heading) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      setTitleInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(heading);
    return () => observer.disconnect();
  }, [scrollDriven]);

  const titleClassName = scrollDriven
    ? `${styles.title} ${styles.titleScroll}`
    : `${styles.title} ${titleInView ? styles.titleReveal : ''}`;

  const titleStyle =
    motion != null
      ? {
          transform: motion.titleTransform,
          opacity: motion.titleOpacity,
        }
      : undefined;

  const nameBlockStyle =
    motion != null && motion.nameBlockTranslateYRem !== 0
      ? { transform: `translateY(${motion.nameBlockTranslateYRem}rem)` }
      : undefined;

  return (
    <section
      id="about"
      className={pairLayout ? styles.sectionPair : styles.section}
      aria-labelledby="about-title about-profile-name"
    >
      <div className={pairLayout ? styles.containerPair : styles.container}>
        <div
          className={
            pairLayout ? `${styles.message} ${styles.messagePair}` : styles.message
          }
        >
          <h2 ref={headingRef} id="about-title" className={styles.heading}>
            <span className={titleClassName} lang="en" style={titleStyle}>
              ABOUT
            </span>
          </h2>
          <div className={styles.nameBlock} style={nameBlockStyle}>
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
          </div>
        </div>
      </div>
    </section>
  );
}
