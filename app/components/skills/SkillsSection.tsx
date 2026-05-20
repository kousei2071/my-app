'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { skillGroups, type SkillItem } from './skillsData';
import styles from './SkillsSection.module.css';

type ViewMode = 'stack' | 'skills';
type TransitionPhase = 'idle' | 'burst' | 'reveal';

type Particle = {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetRotate: number;
  targetScale: number;
  size: number;
};

const PARTICLE_COUNT = 200;
const BURST_DURATION = 1;
const REVEAL_DURATION = 0.42;

/** Stack → Skills のときだけ、少し下に視点をずらす（px） */
const SKILLS_VIEW_SCROLL_OFFSET = 72;

function clampLevel(level: number) {
  return Math.min(100, Math.max(0, level));
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createParticles(container: DOMRect, cardRects: DOMRect[]): Particle[] {
  const spawnRects = cardRects.length > 0 ? cardRects : [container];

  return Array.from({ length: PARTICLE_COUNT }, (_, id) => {
    const rect = spawnRects[id % spawnRects.length];
    const x = rect.left - container.left + rect.width * Math.random();
    const y = rect.top - container.top + rect.height * Math.random();

    return {
      id,
      x,
      y,
      targetX: randomBetween(-220, 220),
      targetY: randomBetween(-160, 160),
      targetRotate: randomBetween(-540, 540),
      targetScale: randomBetween(0.15, 0.85),
      size: randomBetween(4, 9),
    };
  });
}

function SkillMeter({ skill, animateBar }: { skill: SkillItem; animateBar?: boolean }) {
  const level = clampLevel(skill.level);
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.skillRow}>
      <div className={styles.skillLabelRow}>
        <span className={styles.skillNameWrap}>
          <span className={styles.skillDot} aria-hidden="true" />
          <span className={styles.skillName}>{skill.name}</span>
        </span>
        <span className={styles.skillLevel}>{level}%</span>
      </div>
      <motion.div
        className={styles.skillTrack}
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} ${level}%`}
      >
        <motion.span
          className={styles.skillFill}
          initial={animateBar && !reduceMotion ? { width: 0 } : false}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        />
      </motion.div>
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

function StackCards({ cardLabel, hidden }: { cardLabel: string; hidden: boolean }) {
  return (
    <ol
      className={`${styles.cardGrid} ${styles.cardGridStack} ${hidden ? styles.cardsHidden : ''}`}
      aria-label={cardLabel}
      aria-hidden={hidden}
    >
      {siteStack.map((stack, index) => (
        <li key={stack.name}>
          <article className={styles.itemCard} data-skill-card>
            <span className={styles.panelIndex}>{String(index + 1).padStart(2, '0')}</span>
            <div className={styles.panelBody}>
              <h3 className={styles.panelTitle}>{stack.name}</h3>
              <p className={styles.panelDescription}>{stack.description}</p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

function SkillsCards({
  cardLabel,
  hidden,
  animateBars,
}: {
  cardLabel: string;
  hidden: boolean;
  animateBars: boolean;
}) {
  return (
    <div
      className={`${styles.cardGrid} ${hidden ? styles.cardsHidden : ''}`}
      aria-label={cardLabel}
      aria-hidden={hidden}
    >
      {skillGroups.map((group, index) => (
        <article
          key={group.title}
          className={`${styles.itemCard} ${styles.itemCardSkill}`}
          data-skill-card
        >
          <div className={styles.skillPanelHead}>
            <span className={styles.panelIndex}>{String(index + 1).padStart(2, '0')}</span>
            <h3 className={styles.panelTitle}>{group.title}</h3>
          </div>
          <p className={styles.panelDescription}>{group.description}</p>
          <ul className={styles.skillList} aria-label={`${group.title}のスキル`}>
            {group.skills.map((skill) => (
              <li key={skill.name}>
                <SkillMeter skill={skill} animateBar={animateBars} />
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default function SkillsSection() {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<ViewMode>('stack');
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [stageHeight, setStageHeight] = useState<number | undefined>(undefined);

  const contentStageRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef<number | null>(null);
  const pendingViewRef = useRef<ViewMode | null>(null);
  const particlesDoneRef = useRef<Set<number>>(new Set());

  const content = viewContent[view];
  const isTransitioning = phase !== 'idle';
  const cardsHidden = phase === 'burst';
  const animateBars = phase === 'reveal' && view === 'skills';

  useLayoutEffect(() => {
    if (scrollYRef.current === null) {
      return;
    }

    window.scrollTo(0, scrollYRef.current);
    scrollYRef.current = null;
  }, [view]);

  const finishBurst = useCallback(() => {
    const nextView = pendingViewRef.current;
    if (!nextView) {
      return;
    }

    setView(nextView);
    pendingViewRef.current = null;
    setParticles([]);
    setPhase('reveal');
  }, []);

  const handleParticleComplete = useCallback(
    (particleId: number) => {
      particlesDoneRef.current.add(particleId);
      if (particlesDoneRef.current.size >= particles.length) {
        particlesDoneRef.current.clear();
        finishBurst();
      }
    },
    [finishBurst, particles.length],
  );

  const handleRevealComplete = useCallback(() => {
    setPhase('idle');
    setStageHeight(undefined);
  }, []);

  const toggleView = () => {
    if (isTransitioning) {
      return;
    }

    const nextView: ViewMode = view === 'stack' ? 'skills' : 'stack';
    const offset = nextView === 'skills' ? SKILLS_VIEW_SCROLL_OFFSET : 0;
    scrollYRef.current = window.scrollY + offset;

    if (reduceMotion) {
      setView(nextView);
      return;
    }

    const stage = contentStageRef.current;
    if (!stage) {
      setView(nextView);
      return;
    }

    const containerRect = stage.getBoundingClientRect();
    const cardRects = Array.from(stage.querySelectorAll<HTMLElement>('[data-skill-card]')).map(
      (card) => card.getBoundingClientRect(),
    );

    setStageHeight(stage.offsetHeight);
    particlesDoneRef.current.clear();
    pendingViewRef.current = nextView;
    setParticles(createParticles(containerRect, cardRects));
    setPhase('burst');
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
                disabled={isTransitioning}
                aria-label={view === 'stack' ? 'スキル一覧を表示' : 'スタック一覧を表示'}
                aria-pressed={view === 'skills'}
                aria-busy={isTransitioning}
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

          <div
            ref={contentStageRef}
            className={styles.contentStage}
            style={stageHeight !== undefined ? { minHeight: stageHeight } : undefined}
          >
            {phase === 'burst' && particles.length > 0 && (
              <motion.div
                className={styles.particleLayer}
                aria-hidden="true"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {particles.map((particle) => (
                  <motion.span
                    key={particle.id}
                    className={styles.particle}
                    style={{
                      left: particle.x,
                      top: particle.y,
                      width: particle.size,
                      height: particle.size,
                    }}
                    initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: particle.targetX,
                      y: particle.targetY,
                      rotate: particle.targetRotate,
                      scale: particle.targetScale,
                      opacity: 0,
                    }}
                    transition={{ duration: BURST_DURATION, ease: [0.22, 1, 0.36, 1] }}
                    onAnimationComplete={() => handleParticleComplete(particle.id)}
                  />
                ))}
              </motion.div>
            )}

            <motion.div
              key={view}
              className={styles.contentReveal}
              initial={phase === 'reveal' && !reduceMotion ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: REVEAL_DURATION, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => {
                if (phase === 'reveal') {
                  handleRevealComplete();
                }
              }}
            >
              {view === 'stack' ? (
                <StackCards cardLabel={content.cardLabel} hidden={cardsHidden} />
              ) : (
                <SkillsCards
                  cardLabel={content.cardLabel}
                  hidden={cardsHidden}
                  animateBars={animateBars}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
