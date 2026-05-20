'use client';

import { motion, type Variants } from 'framer-motion';
import EngineerDeco from './EngineerDeco';
import { PROFILE_META } from './content/profileMeta';
import { GitHubIcon, MessageIcon } from './icons';
import styles from './profile.module.css';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const asideStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.12 },
  },
};

const asideItemIdle: Variants = {
  hidden: { opacity: 0, x: 0, filter: 'none' },
  show: {
    opacity: 0,
    x: 0,
    filter: 'none',
  },
};

const asideItem: Variants = {
  hidden: { opacity: 0, x: 56, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASE_OUT },
  },
};

type AsideProps = {
  active: boolean;
  githubHref: string;
  contactHref: string;
};

export default function Aside({ active, githubHref, contactHref }: AsideProps) {
  const [hobbyA, hobbyB] = PROFILE_META.hobbies;
  const item = active ? asideItem : asideItemIdle;

  return (
    <motion.aside
      className={styles.asideColumn}
      aria-label="プロフィール補足"
      aria-hidden={!active}
      variants={asideStagger}
      initial="hidden"
      animate={active ? 'show' : 'hidden'}
    >
      <motion.div className={styles.statusCard} variants={item}>
        <p className={styles.statusLabel}>Status</p>
        <p className={styles.statusSchool}>{PROFILE_META.school}</p>
        <p className={styles.statusMajor}>{PROFILE_META.major}</p>
      </motion.div>

      <motion.nav className={styles.asideActions} aria-label="リンク" variants={item}>
        <a
          className={styles.actionButton}
          href={githubHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon className={styles.actionIcon} />
          <span>GitHub</span>
        </a>
        <a className={styles.actionButton} href={contactHref}>
          <MessageIcon className={styles.actionIcon} />
          <span>Contact</span>
        </a>
      </motion.nav>

      <motion.div className={styles.metaCompact} variants={item}>
        <div className={styles.metaRow}>
          <p className={styles.metaLabel}>趣味</p>
          <p className={styles.metaText}>
            {hobbyA}
            <span className={styles.metaSep} aria-hidden="true">
              {' '}
              /{' '}
            </span>
            {hobbyB}
          </p>
        </div>
        <div className={styles.metaRow}>
          <p className={styles.metaLabel}>出身地</p>
          <p className={styles.metaText}>{PROFILE_META.birthplace}</p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <EngineerDeco />
      </motion.div>
    </motion.aside>
  );
}
