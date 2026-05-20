'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './bridge.module.css';

const INTENT_TOTAL = 40;
const ACCUM_RESET_MS = 280;
const TOUCH_THRESHOLD = 26;
const SCROLL_LOCK_MS = 1050;

type SnapPhase = 'profile' | 'career';

function getElementDocBottom(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  return window.scrollY + r.bottom;
}

function getElementDocTop(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  return window.scrollY + r.top;
}

function getElementDocCenter(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  return window.scrollY + r.top + r.height / 2;
}

/**
 * プロフィール ↔ 経歴の橋渡しゾーン（案A・双方向）。
 */
export default function Bridge() {
  const bridgeRef = useRef<HTMLDivElement>(null);
  const bridgeArmedRef = useRef(false);
  const upZoneRef = useRef(false);
  const transitioningRef = useRef(false);
  const phaseRef = useRef<SnapPhase>('profile');
  const intentAccumRef = useRef(0);
  const intentDirRef = useRef<'down' | 'up' | null>(null);
  const accumResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchAccumRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const clearIntent = useCallback(() => {
    intentAccumRef.current = 0;
    intentDirRef.current = null;
    if (accumResetTimerRef.current !== null) {
      clearTimeout(accumResetTimerRef.current);
      accumResetTimerRef.current = null;
    }
  }, []);

  const finishTransition = useCallback(() => {
    window.setTimeout(() => {
      transitioningRef.current = false;
    }, reduceMotion ? 0 : SCROLL_LOCK_MS);
  }, [reduceMotion]);

  const snapToCareer = useCallback(() => {
    const profile = document.getElementById('profile');
    const career = document.getElementById('career');
    if (!career || !profile || transitioningRef.current) return;

    transitioningRef.current = true;
    phaseRef.current = 'career';
    clearIntent();
    touchAccumRef.current = 0;

    const behavior = reduceMotion ? 'auto' : 'smooth';
    const careerTitle = document.getElementById('career-title');
    const titleOffset = Math.min(window.innerHeight * 0.16, 140);
    const top = careerTitle
      ? Math.max(getElementDocTop(careerTitle) - titleOffset, getElementDocBottom(profile) + 12)
      : Math.max(getElementDocTop(career), getElementDocBottom(profile) + 12);

    window.scrollTo({ top, behavior });
    finishTransition();
  }, [reduceMotion, clearIntent, finishTransition]);

  const snapToProfile = useCallback(() => {
    const profile = document.getElementById('profile');
    if (!profile || transitioningRef.current) return;

    transitioningRef.current = true;
    phaseRef.current = 'profile';
    clearIntent();
    touchAccumRef.current = 0;

    /* 下から上へ戻るときはページ最上部まで */
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
    finishTransition();
  }, [reduceMotion, clearIntent, finishTransition]);

  const addIntent = useCallback(
    (direction: 'down' | 'up', amount: number) => {
      if (transitioningRef.current || amount <= 0) return false;

      if (direction === 'down' && phaseRef.current !== 'profile') return false;
      if (direction === 'up' && phaseRef.current !== 'career') return false;
      if (direction === 'down' && !bridgeArmedRef.current) return false;
      if (direction === 'up' && !bridgeArmedRef.current && !upZoneRef.current) return false;

      if (intentDirRef.current !== direction) {
        intentDirRef.current = direction;
        intentAccumRef.current = 0;
      }

      intentAccumRef.current += amount;

      if (accumResetTimerRef.current !== null) {
        clearTimeout(accumResetTimerRef.current);
      }
      accumResetTimerRef.current = setTimeout(clearIntent, ACCUM_RESET_MS);

      if (intentAccumRef.current >= INTENT_TOTAL) {
        if (direction === 'down') snapToCareer();
        else snapToProfile();
        return true;
      }

      return false;
    },
    [clearIntent, snapToCareer, snapToProfile],
  );

  useEffect(() => {
    if (reduceMotion) return;

    const bridge = bridgeRef.current;
    if (!bridge) return;

    const syncPhaseFromScroll = () => {
      if (transitioningRef.current) return;

      const profile = document.getElementById('profile');
      const career = document.getElementById('career');
      const careerTitle = document.getElementById('career-title');
      if (!profile || !career || !careerTitle) return;

      const viewportMid = window.scrollY + window.innerHeight / 2;
      const profileDist = Math.abs(getElementDocCenter(profile) - viewportMid);
      const careerDist = Math.abs(getElementDocCenter(careerTitle) - viewportMid);

      if (careerDist < profileDist && careerDist < window.innerHeight * 0.38) {
        phaseRef.current = 'career';
      } else if (profileDist < window.innerHeight * 0.38) {
        phaseRef.current = 'profile';
      }
    };

    const syncZones = () => {
      const bridgeRect = bridge.getBoundingClientRect();
      const career = document.getElementById('career');
      const careerRect = career?.getBoundingClientRect();

      bridgeArmedRef.current =
        bridgeRect.top < window.innerHeight * 0.94 && bridgeRect.bottom > 0;

      upZoneRef.current =
        phaseRef.current === 'career' &&
        !!careerRect &&
        careerRect.top < window.innerHeight * 0.72 &&
        careerRect.bottom > window.innerHeight * 0.12;

      syncPhaseFromScroll();
    };

    const observer = new IntersectionObserver(syncZones, {
      threshold: [0, 0.05, 0.15, 0.35, 0.55],
    });

    observer.observe(bridge);
    const career = document.getElementById('career');
    if (career) observer.observe(career);

    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      syncZones();

      if (transitioningRef.current) {
        lastScrollYRef.current = window.scrollY;
        return;
      }

      const dy = window.scrollY - lastScrollYRef.current;
      lastScrollYRef.current = window.scrollY;

      if (dy > 2) addIntent('down', dy);
      else if (dy < -2) addIntent('up', Math.abs(dy));
    };

    const onWheel = (e: WheelEvent) => {
      if (transitioningRef.current) return;

      if (e.deltaY > 0) {
        if (phaseRef.current !== 'profile' || !bridgeArmedRef.current) return;
        e.preventDefault();
        addIntent('down', e.deltaY);
        return;
      }

      if (e.deltaY < 0) {
        if (phaseRef.current !== 'career') return;
        if (!bridgeArmedRef.current && !upZoneRef.current) return;
        e.preventDefault();
        addIntent('up', Math.abs(e.deltaY));
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
      touchAccumRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (transitioningRef.current || touchStartYRef.current === null) return;

      const y = e.touches[0]?.clientY;
      if (y === undefined) return;

      const delta = touchStartYRef.current - y;
      if (Math.abs(delta) < 2) return;

      const dir: 'down' | 'up' = delta > 0 ? 'down' : 'up';

      if (dir === 'down' && (phaseRef.current !== 'profile' || !bridgeArmedRef.current)) return;
      if (
        dir === 'up' &&
        (phaseRef.current !== 'career' || (!bridgeArmedRef.current && !upZoneRef.current))
      ) {
        return;
      }

      e.preventDefault();
      touchAccumRef.current += Math.abs(delta);
      touchStartYRef.current = y;

      if (touchAccumRef.current >= TOUCH_THRESHOLD) {
        touchStartYRef.current = null;
        touchAccumRef.current = 0;
        if (dir === 'down') snapToCareer();
        else snapToProfile();
      }
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
      touchAccumRef.current = 0;
    };

    syncZones();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', syncZones, { passive: true });

    return () => {
      observer.disconnect();
      clearIntent();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', syncZones);
    };
  }, [reduceMotion, addIntent, snapToCareer, snapToProfile, clearIntent]);

  return (
    <div
      ref={bridgeRef}
      id="about-career-bridge"
      className={reduceMotion ? styles.bridgeReduced : styles.bridge}
      aria-hidden
    />
  );
}
