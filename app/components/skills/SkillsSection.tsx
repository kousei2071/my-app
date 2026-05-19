'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { skillGroups, type SkillItem } from './skillsData';
import styles from './SkillsSection.module.css';

type ViewMode = 'stack' | 'skills';

function clampLevel(level: number) {
  return Math.min(100, Math.max(0, level));
}

function SkillMeter({ skill }: { skill: SkillItem }) {
  const level = clampLevel(skill.level);

  return (
    <div className={styles.skillRow}>
      <div className={styles.skillLabelRow}>
        <span className={styles.skillNameWrap}>
          <span className={styles.skillDot} aria-hidden="true" />
          <span className={styles.skillName}>{skill.name}</span>
        </span>
        <span className={styles.skillLevel}>{level}%</span>
      </div>
      <div
        className={styles.skillTrack}
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} ${level}%`}
      >
        <span className={styles.skillFill} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

const siteStack = [
  {
    name: 'Next.js 16.2.4',
    description: 'ページとセクションをコンポーネント単位で分けて構成しています。',
  },
  {
    name: 'React 19.2.4',
    description: 'コンポーネント単位でUIを分け、ページ全体を管理しやすくします。',
  },
  {
    name: 'TypeScript 5',
    description: '型をつけて、変更しやすいコードにしています。',
  },
  {
    name: 'CSS Modules',
    description: 'セクションごとにスタイルを閉じ込め、見た目の衝突を防いでいます。',
  },
  {
    name: 'Tailwind CSS',
    description: 'スマホやタブレット向けのレイアウトや、アニメーションを作ります。',
  },
];

const viewContent = {
  stack: {
    lead: 'このポートフォリオを構成している技術です。',
    cardLabel: 'This Site Stack',
    viewBadge: 'Site',
  },
  skills: {
    lead: 'これまで学習・制作で使ってきた技術です。',
    cardLabel: 'Core Skills',
    viewBadge: 'Skills',
  },
} as const;

/** Stack → Skills のときだけ、少し下に視点をずらす（px） */
const SKILLS_VIEW_SCROLL_OFFSET = 72;

export default function SkillsSection() {
  const [view, setView] = useState<ViewMode>('stack');
  const content = viewContent[view];
  const scrollYRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (scrollYRef.current === null) {
      return;
    }

    window.scrollTo(0, scrollYRef.current);
    scrollYRef.current = null;
  }, [view]);

  const toggleView = () => {
    const nextView: ViewMode = view === 'stack' ? 'skills' : 'stack';
    const offset = nextView === 'skills' ? SKILLS_VIEW_SCROLL_OFFSET : 0;

    scrollYRef.current = window.scrollY + offset;
    setView(nextView);
  };

  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <p className={styles.backgroundText} aria-hidden="true">
        STACK &amp; SKILLS
      </p>
      <div className={styles.inner}>
        <div className={styles.headingBlock}>
          <h2 id="skills-title" className={styles.title}>
            STACK &amp; SKILLS
          </h2>
          <p className={styles.lead}>{content.lead}</p>
        </div>

        <div className={styles.cardColumn}>
          <div className={styles.listHeader}>
            <p className={styles.cardLabel}>{content.cardLabel}</p>
            <div className={styles.listHeaderActions}>
              <button
                type="button"
                className={styles.toggleButton}
                onClick={toggleView}
                aria-label={view === 'stack' ? 'スキル一覧を表示' : 'スタック一覧を表示'}
                aria-pressed={view === 'skills'}
              >
                <Image
                  src="/icons/search.png"
                  alt=""
                  width={22}
                  height={22}
                  className={styles.toggleButtonIcon}
                />
              </button>
              <span className={styles.viewBadge}>{content.viewBadge}</span>
            </div>
          </div>

          {view === 'stack' ? (
            <ol className={`${styles.cardGrid} ${styles.cardGridStack}`} aria-label={content.cardLabel}>
              {siteStack.map((stack, index) => (
                <li key={stack.name}>
                  <article className={styles.itemCard}>
                    <span className={styles.panelIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <div className={styles.panelBody}>
                      <h3 className={styles.panelTitle}>{stack.name}</h3>
                      <p className={styles.panelDescription}>{stack.description}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <div className={styles.cardGrid} aria-label={content.cardLabel}>
              {skillGroups.map((group, index) => (
                <article key={group.title} className={`${styles.itemCard} ${styles.itemCardSkill}`}>
                  <div className={styles.skillPanelHead}>
                    <span className={styles.panelIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <h3 className={styles.panelTitle}>{group.title}</h3>
                  </div>
                  <p className={styles.panelDescription}>{group.description}</p>
                  <ul className={styles.skillList} aria-label={`${group.title}のスキル`}>
                    {group.skills.map((skill) => (
                      <li key={skill.name}>
                        <SkillMeter skill={skill} />
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
