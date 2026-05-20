'use client';

import { useCallback, useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, type Variants } from 'framer-motion';
import AboutPageAside from './AboutPageAside';
import styles from './styles/AboutDetailView.module.css';

const PROFILE = {
  nameJa: '富田 幸聖',
  nameEn: 'Kousei Tomita',
  lead: 'Webアプリケーションを中心に開発しています。',
  body:
    '開発において、単に機能を実装するだけでなく、なぜその技術スタックを選んだのかという「選定理由」を大切にしています。また、ユーザーの利便性を考えて、UI/UXを最適化しています。',
};

const LINKS = {
  github: 'https://github.com/kousei2071',
  contact: 'mailto:contact@example.com',
};

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LAYOUT_TRANSITION = { duration: 0.9, ease: EASE_OUT };

const slideFromRight: Variants = {
  hidden: {
    opacity: 0,
    x: 72,
    filter: 'blur(10px)',
  },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: EASE_OUT,
    },
  },
};

const titleVariant: Variants = {
  hidden: {
    opacity: 0,
    x: 96,
    filter: 'blur(12px)',
  },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.05,
      ease: EASE_OUT,
    },
  },
};

const profileStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

const bgTitleVariant: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.2, ease: EASE_OUT },
  },
};

const staticShow: Variants = {
  hidden: { opacity: 1, x: 0, filter: 'none' },
  show: { opacity: 1, x: 0, filter: 'none' },
};

export default function AboutPageProfile() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<'intro' | 'split'>('intro');
  const columnX = useMotionValue(0);

  useEffect(() => {
    if (reduceMotion) setPhase('split');
  }, [reduceMotion]);

  useEffect(() => {
    if (phase !== 'split' || reduceMotion) return;
    columnX.set(120);
    void animate(columnX, 0, { duration: 0.92, ease: EASE_OUT });
  }, [phase, reduceMotion, columnX]);

  const item = reduceMotion ? staticShow : slideFromRight;
  const title = reduceMotion ? staticShow : titleVariant;
  const stagger = reduceMotion ? staticShow : profileStagger;
  const bg = reduceMotion ? staticShow : bgTitleVariant;

  const handleIntroComplete = useCallback(
    (definition: string) => {
      if (definition === 'show' && !reduceMotion) {
        setPhase('split');
      }
    },
    [reduceMotion],
  );

  const isSplit = phase === 'split';

  return (
    <section id="profile" className={styles.profileSection} aria-labelledby="detail-about-title">
      <motion.p
        className={styles.bgTitleLeft}
        aria-hidden="true"
        variants={bg}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.05 }}
      >
        ABOUT
      </motion.p>
      <motion.p
        className={styles.bgTitleRight}
        aria-hidden="true"
        variants={bg}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.12 }}
      >
        ABOUT
      </motion.p>

      <motion.div
        layout
        className={`${styles.profileContainer} ${isSplit ? styles.profileContainerSplit : ''}`}
        transition={{ layout: LAYOUT_TRANSITION }}
      >
        <motion.div
          layout
          className={styles.profileColumn}
          style={{ x: columnX }}
          transition={{ layout: LAYOUT_TRANSITION }}
        >
          <motion.div
            className={styles.profileMessage}
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.h1 id="detail-about-title" className={styles.heading} variants={title}>
              <span className={styles.titleWrap}>
                <span className={styles.title} lang="en">
                  ABOUT
                </span>
              </span>
            </motion.h1>
            <motion.p className={styles.nameJa} lang="ja" variants={item}>
              {PROFILE.nameJa}
            </motion.p>
            <motion.p className={styles.nameEn} lang="en" variants={item}>
              {PROFILE.nameEn}
            </motion.p>
            <motion.p className={styles.lead} variants={item}>
              {PROFILE.lead}
            </motion.p>
            <motion.p
              className={styles.body}
              variants={item}
              onAnimationComplete={handleIntroComplete}
            >
              {PROFILE.body}
            </motion.p>
          </motion.div>
        </motion.div>

        {isSplit && <AboutPageAside githubHref={LINKS.github} contactHref={LINKS.contact} />}
      </motion.div>
    </section>
  );
}
