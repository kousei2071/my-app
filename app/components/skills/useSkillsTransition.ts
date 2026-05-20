'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { SCROLL_SKILLS, type Phase, type View } from './skillsConfig';
import { buildParticles, type Particle } from './skillsParticles';

const scrollInstant = (y: number) => {
  window.scrollTo({ top: y, left: 0, behavior: 'instant' });
};

/**
 * Stack/Skills の切り替え状態とパーティクル遷移をまとめて管理する。
 *
 * スクロール方針:
 * - Stack → Skills: 切り替え後に SCROLL_SKILLS だけ下へ
 * - Skills → Stack: 開始時の Y をロック（高さが縮んでも視点を動かさない）
 */
export function useSkillsTransition(reduceMotion: boolean | null) {
  const [view, setView] = useState<View>('stack');
  const [phase, setPhase] = useState<Phase>('idle');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [minH, setMinH] = useState<number | undefined>(undefined);

  const stageRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<View | null>(null);
  const doneIdsRef = useRef<Set<number>>(new Set());
  /** Stack → Skills 後にスクロールする Y */
  const scrollToRef = useRef<number | null>(null);
  /** Skills → Stack 中に固定する Y */
  const scrollLockRef = useRef<number | null>(null);

  const busy = phase !== 'idle';
  const hideCards = phase === 'burst';
  const animateBars = phase === 'reveal' && view === 'skills';

  useLayoutEffect(() => {
    if (scrollToRef.current !== null) {
      scrollInstant(scrollToRef.current);
      scrollToRef.current = null;
    }
  }, [view]);

  useLayoutEffect(() => {
    if (scrollLockRef.current === null) {
      return;
    }
    scrollInstant(scrollLockRef.current);
    if (phase === 'idle') {
      scrollLockRef.current = null;
    }
  }, [view, phase, minH]);

  const prepScroll = (next: View) => {
    if (next === 'skills') {
      scrollToRef.current = window.scrollY + SCROLL_SKILLS;
      scrollLockRef.current = null;
    } else {
      scrollToRef.current = null;
      scrollLockRef.current = window.scrollY;
    }
  };

  const endBurst = useCallback(() => {
    const next = pendingRef.current;
    if (!next) {
      return;
    }
    setView(next);
    pendingRef.current = null;
    setParticles([]);
    setPhase('reveal');
  }, []);

  const onParticleDone = useCallback(
    (id: number) => {
      doneIdsRef.current.add(id);
      if (doneIdsRef.current.size >= particles.length) {
        doneIdsRef.current.clear();
        endBurst();
      }
    },
    [endBurst, particles.length],
  );

  const onRevealDone = useCallback(() => {
    setPhase('idle');
    setMinH(undefined);
  }, []);

  const toggle = () => {
    if (busy) {
      return;
    }

    const next: View = view === 'stack' ? 'skills' : 'stack';
    prepScroll(next);

    if (reduceMotion) {
      setView(next);
      return;
    }

    const stage = stageRef.current;
    if (!stage) {
      setView(next);
      return;
    }

    const box = stage.getBoundingClientRect();
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-skill-card]')).map((el) =>
      el.getBoundingClientRect(),
    );

    // 高さロックは Stack → Skills のみ（Skills → Stack で minHeight 解除時のガクつき防止）
    setMinH(next === 'skills' ? stage.offsetHeight : undefined);

    doneIdsRef.current.clear();
    pendingRef.current = next;
    setParticles(buildParticles(box, cards));
    setPhase('burst');
  };

  return {
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
  };
}
