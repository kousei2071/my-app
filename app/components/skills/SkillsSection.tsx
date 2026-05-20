'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { ParticleBurst } from './ParticleBurst';
import { SkillCards } from './SkillCards';
import { EASE, REVEAL_S, viewMeta } from './skillsConfig';
import { useSkillsTransition } from './useSkillsTransition';
import styles from './SkillsSection.module.css';

export default function SkillsSection() {
  const reduceMotion = useReducedMotion();
  const {
    view,
    phase,
    particles,
    minH,
    stageRef,
    busy,
    hideCards,
    animateBars,
    toggle,
    onParticleDone,
    onRevealDone,
  } = useSkillsTransition(reduceMotion);

  const meta = viewMeta[view];
  const showBurst = phase === 'burst' && particles.length > 0;

  const revealFrom =
    phase === 'reveal' && !reduceMotion
      ? view === 'stack'
        ? { opacity: 0 }
        : { opacity: 0, y: 14 }
      : false;

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
          <p className={styles.lead}>{meta.lead}</p>
        </div>

        <div className={styles.cardColumn}>
          <div className={styles.listHeader}>
            <p className={styles.cardLabel}>{meta.cardLabel}</p>
            <div className={styles.listHeaderActions}>
              <button
                type="button"
                className={styles.toggleButton}
                onClick={toggle}
                disabled={busy}
                aria-label={view === 'stack' ? 'スキル一覧を表示' : 'スタック一覧を表示'}
                aria-pressed={view === 'skills'}
                aria-busy={busy}
              >
                <Image
                  src="/icons/search.webp"
                  alt=""
                  width={22}
                  height={22}
                  className={styles.toggleButtonIcon}
                />
              </button>
              <span className={styles.viewBadge}>{meta.viewBadge}</span>
            </div>
          </div>

          <div
            ref={stageRef}
            className={styles.contentStage}
            style={minH !== undefined ? { minHeight: minH } : undefined}
          >
            <LazyMotion features={domAnimation} strict>
              {showBurst && <ParticleBurst items={particles} onDone={onParticleDone} />}

              <m.div
                key={view}
                className={styles.contentReveal}
                initial={revealFrom}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: REVEAL_S, ease: EASE }}
                onAnimationComplete={() => {
                  if (phase === 'reveal') {
                    onRevealDone();
                  }
                }}
              >
                <SkillCards
                  view={view}
                  label={meta.cardLabel}
                  hidden={hideCards}
                  animateBars={animateBars}
                />
              </m.div>
            </LazyMotion>
          </div>
        </div>
      </div>
    </section>
  );
}
