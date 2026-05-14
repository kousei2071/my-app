'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AboutSection.module.css';

type AboutSectionProps = {
  nameJa: string;
  nameEn: string;
};

export default function AboutSection({ nameJa, nameEn }: AboutSectionProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [titleInView, setTitleInView] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-title about-profile-name"
    >
      <div className={styles.container}>
        <div className={styles.message}>
          <h2 ref={headingRef} id="about-title" className={styles.heading}>
            <span
              className={`${styles.title} ${titleInView ? styles.titleReveal : ''}`}
              lang="en"
            >
              ABOUT
            </span>
          </h2>
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
    </section>
  );
}
