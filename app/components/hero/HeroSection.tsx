'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';

type HeroSectionProps = {
  title: string;
  subtitle: string;
};

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!indicatorRef.current) return;

    const animation = indicatorRef.current.animate(
      [
        { transform: 'translateY(0px)', opacity: 0.65 },
        { transform: 'translateY(10px)', opacity: 1 },
        { transform: 'translateY(0px)', opacity: 0.65 },
      ],
      {
        duration: 1400,
        iterations: Infinity,
        easing: 'ease-in-out',
      },
    );

    return () => animation.cancel();
  }, []);

  return (
    <section className={styles.sec} aria-labelledby="hero-title">
      <div className={styles.cnt}>
        <h1 id="hero-title" className={styles.ttl}>
          {title}
        </h1>
        <div className={styles.div} aria-hidden="true" />
        <p className={styles.sub}>{subtitle}</p>
      </div>
      <div className={styles.siw} aria-hidden="true">
        <div ref={indicatorRef} className={styles.si}>
          <div className={styles.ln} />
          <div className={styles.dot} />
        </div>
      </div>
      <Image
        src="/myline.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.bg}
      />
    </section>
  );
}
