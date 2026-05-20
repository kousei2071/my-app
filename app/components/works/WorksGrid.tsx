'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import WorkCard from './WorkCard';

const WorkDetailModal = dynamic(() => import('./WorkDetailModal'), { ssr: false });
import styles from './WorksSection.module.css';
import { works, type Work } from './worksData';

export default function WorksGrid() {
  const [openWork, setOpenWork] = useState<Work | null>(null);

  const handleOpen = useCallback((work: Work) => {
    setOpenWork(work);
  }, []);

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
            onOpen={() => handleOpen(work)}
          />
        ))}
      </div>
      <WorkDetailModal work={openWork} onClose={handleClose} />
    </>
  );
}
