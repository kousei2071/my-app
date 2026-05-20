'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { MODAL_SCROLL_ROOT_ATTR } from '../shared/modal/constants';
import { useModalLayerLock } from '../shared/modal/useModalLayerLock';
import styles from './WorkDetailModal.module.css';
import type { Work } from './worksData';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type WorkDetailModalProps = {
  work: Work | null;
  onClose: () => void;
};

export default function WorkDetailModal({ work, onClose }: WorkDetailModalProps) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useModalLayerLock(Boolean(work));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!work) {
      return;
    }

    document.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [work, handleKeyDown]);

  const backdropMotion = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const dialogMotion = reduceMotion
    ? { initial: { opacity: 1, y: 0, scale: 1 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 1, y: 0, scale: 1 } }
    : {
        initial: { opacity: 0, y: 20, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
      };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {work ? (
          <m.div
            className={styles.backdrop}
            role="presentation"
            onClick={onClose}
            {...backdropMotion}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <m.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={styles.dialog}
              onClick={(event) => event.stopPropagation()}
              {...dialogMotion}
              transition={{ duration: 0.32, ease: EASE_OUT }}
            >
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="詳細を閉じる"
            >
              ×
            </button>
            <div className={styles.media}>
              {work.image ? (
                <div className={styles.mediaFrame}>
                  <Image
                    src={work.image}
                    alt={work.imageAlt ?? work.title}
                    fill
                    sizes="(max-width: 720px) 94vw, 720px"
                    className={styles.mediaImg}
                  />
                </div>
              ) : (
                <div className={styles.mediaPlaceholder}>{work.title}</div>
              )}
            </div>
            <div className={styles.body} {...{ [MODAL_SCROLL_ROOT_ATTR]: '' }}>
              <div className={styles.meta}>
                <span>{work.role}</span>
                <span>{work.period}</span>
              </div>
              <h3 id={titleId} className={styles.title}>
                {work.title}
              </h3>
              <p className={styles.description}>{work.description}</p>
              <ul className={styles.tags} aria-label={`${work.title}の使用技術`}>
                {work.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className={styles.actions}>
                {work.demoUrl ? (
                  <a
                    className={`${styles.link} ${styles.linkPrimary}`}
                    href={work.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    デモを表示
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
                <a
                  className={`${styles.link} ${work.demoUrl ? styles.linkSecondary : styles.linkPrimary}`}
                  href={work.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  リポジトリを表示
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>,
    document.body,
  );
}
