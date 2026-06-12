'use client';

import Image from 'next/image';
import styles from './WorksSection.module.css';
import type { Work } from './worksData';

type WorkCardProps = {
  work: Work;
  index: number;
  isOpen: boolean;
  onOpen: () => void;
};

const CARD_TAG_LIMIT = 3;

export default function WorkCard({ work, index, isOpen, onOpen }: WorkCardProps) {
  const visibleTags = work.tags.slice(0, CARD_TAG_LIMIT);

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onOpen}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      aria-label={`${work.title}の詳細を表示`}
    >
      <div className={styles.cardTop}>
        <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.period}>{work.period}</span>
      </div>
      <div
        className={`${styles.preview} ${work.image ? styles.previewImage : ''}`}
        aria-hidden={work.image ? undefined : true}
      >
        {work.image ? (
          <>
            <div className={styles.previewChrome} aria-hidden>
              <span className={styles.previewDot} />
              <span className={styles.previewDot} />
              <span className={styles.previewDot} />
            </div>
            <div className={styles.previewViewport}>
              <Image
                src={work.image}
                alt={work.imageAlt ?? `${work.title}のスクリーンショット`}
                fill
                quality={80}
                sizes="(max-width: 960px) 100vw, 33vw"
                className={styles.previewImg}
              />
            </div>
          </>
        ) : (
          <>
            <span />
            <span />
            <span />
            <div className={styles.previewWindow}>
              <div className={styles.previewTitle}>{work.title}</div>
              <div className={styles.previewLine} />
              <div className={styles.previewLineShort} />
            </div>
          </>
        )}
      </div>
      <div className={styles.cardBody}>
        <p className={styles.role}>{work.role}</p>
        <h3 className={styles.cardTitle}>{work.title}</h3>
        <p className={styles.summary}>{work.summary}</p>
        <ul className={styles.tags} aria-label={`${work.title}の使用技術`}>
          {visibleTags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </button>
  );
}
