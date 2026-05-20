'use client';

import { m, useReducedMotion } from 'framer-motion';
import { skillGroups, type SkillItem } from './skillsData';
import { siteStack, type View } from './skillsConfig';
import styles from './SkillsSection.module.css';

const clamp = (n: number) => Math.min(100, Math.max(0, n));
const idx = (i: number) => String(i + 1).padStart(2, '0');

function Meter({ skill, animate }: { skill: SkillItem; animate?: boolean }) {
  const lv = clamp(skill.level);
  const reduce = useReducedMotion();

  return (
    <div className={styles.skillRow}>
      <div className={styles.skillLabelRow}>
        <span className={styles.skillNameWrap}>
          <span className={styles.skillDot} aria-hidden="true" />
          <span className={styles.skillName}>{skill.name}</span>
        </span>
        <span className={styles.skillLevel}>{lv}%</span>
      </div>
      <m.div
        className={styles.skillTrack}
        role="progressbar"
        aria-valuenow={lv}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} ${lv}%`}
      >
        <m.span
          className={styles.skillFill}
          initial={animate && !reduce ? { width: 0 } : false}
          animate={{ width: `${lv}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        />
      </m.div>
    </div>
  );
}

type CardsProps = {
  view: View;
  label: string;
  hidden: boolean;
  animateBars: boolean;
};

export function SkillCards({ view, label, hidden, animateBars }: CardsProps) {
  const hide = hidden ? styles.cardsHidden : '';

  if (view === 'stack') {
    return (
      <ol
        className={`${styles.cardGrid} ${styles.cardGridStack} ${hide}`}
        aria-label={label}
        aria-hidden={hidden}
      >
        {siteStack.map((item, i) => (
          <li key={item.name}>
            <article className={styles.itemCard} data-skill-card>
              <span className={styles.panelIndex}>{idx(i)}</span>
              <div className={styles.panelBody}>
                <h3 className={styles.panelTitle}>{item.name}</h3>
                <p className={styles.panelDescription}>{item.description}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className={`${styles.cardGrid} ${hide}`} aria-label={label} aria-hidden={hidden}>
      {skillGroups.map((group, i) => (
        <article
          key={group.title}
          className={`${styles.itemCard} ${styles.itemCardSkill}`}
          data-skill-card
        >
          <div className={styles.skillPanelHead}>
            <span className={styles.panelIndex}>{idx(i)}</span>
            <h3 className={styles.panelTitle}>{group.title}</h3>
          </div>
          <p className={styles.panelDescription}>{group.description}</p>
          <ul className={styles.skillList} aria-label={`${group.title}のスキル`}>
            {group.skills.map((skill) => (
              <li key={skill.name}>
                <Meter skill={skill} animate={animateBars} />
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
