'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import styles from './styles/AboutDetailView.module.css';

const PROFILE = {
  nameJa: '富田 幸聖',
  nameEn: 'Kousei Tomita',
  lead: 'Webアプリケーションを中心に開発しています。',
  body:
    '開発において、単に機能を実装するだけでなく、なぜその技術スタックを選んだのかという「選定理由」を大切にしています。また、ユーザーの利便性を考えて、UI/UXを最適化しています。',
};

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
  const item = reduceMotion ? staticShow : slideFromRight;
  const title = reduceMotion ? staticShow : titleVariant;
  const stagger = reduceMotion ? staticShow : profileStagger;
  const bg = reduceMotion ? staticShow : bgTitleVariant;

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

      <div className={styles.profileContainer}>
        <motion.div
          className={styles.profileMessage}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.h1 id="detail-about-title" className={styles.heading} variants={title}>
            <span className={styles.title} lang="en">
              ABOUT
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
          <motion.p className={styles.body} variants={item}>
            {PROFILE.body}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
