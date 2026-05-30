'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const SkillsSection = dynamic(() => import('./SkillsSection'), {
  loading: () => (
    <section id="skills" className="min-h-[50vh]" aria-hidden="true" />
  ),
});

export default function SkillsDeferred() {
  const hitRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReady(true);
      return;
    }

    const el = hitRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: '240px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hitRef}>
      {ready ? (
        <SkillsSection />
      ) : (
        <section id="skills" className="min-h-[50vh]" aria-hidden="true" />
      )}
    </div>
  );
}
