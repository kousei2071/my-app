'use client';

import { useCallback, useState, type ComponentType } from 'react';
import WorkCard from './WorkCard';
import styles from './WorksSection.module.css';
import { works, type Work } from './worksData';

type WorkDetailModalProps = {
  work: Work | null;
  onClose: () => void;
};

export default function WorksGrid() {
  const [openWork, setOpenWork] = useState<Work | null>(null);
  const [Modal, setModal] = useState<ComponentType<WorkDetailModalProps> | null>(null);

  const handleOpen = useCallback(async (work: Work) => {
    if (!Modal) {
      const mod = await import('./WorkDetailModal');
      setModal(() => mod.default);
    }
    setOpenWork(work);
  }, [Modal]);

  const handleClose = useCallback(() => {
    setOpenWork(null);
  }, []);

  return (
    <>
      <div className={styles.grid} aria-label="制作したWebサイト一覧">
        {works.map((work, index) => (
          <WorkCard
            key={work.title}
            work={work}
            index={index}
            isOpen={openWork?.title === work.title}
            onOpen={() => void handleOpen(work)}
          />
        ))}
      </div>
      {Modal ? <Modal work={openWork} onClose={handleClose} /> : null}
    </>
  );
}
