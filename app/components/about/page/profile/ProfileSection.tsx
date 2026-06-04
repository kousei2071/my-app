'use client';

import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, type Variants } from 'framer-motion';
import Aside from './Aside';
import styles from './profile.module.css';

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

const PROFILE = {
  nameJa: '富田 幸聖',
  nameEn: 'Kousei Tomita',
  lead: 'Webアプリケーションを中心に開発しています。',
  body:
    '開発において、単に機能を実装するだけでなく、なぜその技術スタックを選んだのかという「選定理由」を大切にしています。また、ユーザーの利便性を考えて、UI/UXを最適化しています。',
};

const LINKS = {
  github: 'https://github.com/kousei2071',
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
    y: 28,
    filter: 'blur(12px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.05,
      ease: EASE_OUT,
      opacity: { duration: 0.55, delay: 0.45, ease: EASE_OUT },
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

const staticShow: Variants = {
  hidden: { opacity: 1, x: 0, filter: 'none' },
  show: { opacity: 1, x: 0, filter: 'none' },
};

export default function ProfileSection() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<'intro' | 'split'>('intro');
  const [contactOpen, setContactOpen] = useState(false);
  const [ContactModal, setContactModal] = useState<ComponentType<ContactModalProps> | null>(null);
  const columnX = useMotionValue(0);

  const handleContactOpen = useCallback(async () => {
    if (!ContactModal) {
      const mod = await import('../../../contact/ContactModal');
      setContactModal(() => mod.default);
    }
    setContactOpen(true);
  }, [ContactModal]);

  const handleContactClose = useCallback(() => {
    setContactOpen(false);
  }, []);

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
      <div className={styles.bgLayer} aria-hidden="true">
        <div className={styles.bgTitleLeftWrap}>
          <p className={styles.bgTitleText}>ABOUT</p>
        </div>
        <p className={`${styles.bgTitleText} ${styles.bgTitleRight}`}>ABOUT</p>
      </div>

      <motion.div
        className={`${styles.profileContainer} ${styles.profileContainerSplit} ${!isSplit ? styles.profileContainerIntro : ''}`}
      >
        <motion.div
          className={styles.profileColumn}
          style={{ x: columnX }}
          transition={{ duration: 0.92, ease: EASE_OUT }}
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

        <div className={!isSplit ? styles.asideInert : undefined} aria-hidden={!isSplit}>
          <Aside
            active={isSplit}
            githubHref={LINKS.github}
            onContactOpen={() => void handleContactOpen()}
          />
        </div>
      </motion.div>

      {ContactModal ? <ContactModal open={contactOpen} onClose={handleContactClose} /> : null}
    </section>
  );
}
