'use client';

import { motion } from 'framer-motion';
import { BURST_S, EASE } from './skillsConfig';
import type { Particle } from './skillsParticles';
import styles from './SkillsSection.module.css';

type Props = {
  items: Particle[];
  onDone: (id: number) => void;
};

export function ParticleBurst({ items, onDone }: Props) {
  return (
    <motion.div className={styles.particleLayer} aria-hidden="true">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className={styles.particle}
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.tx, y: p.ty, rotate: p.rot, scale: p.scale, opacity: 0 }}
          transition={{ duration: BURST_S, ease: EASE }}
          onAnimationComplete={() => onDone(p.id)}
        />
      ))}
    </motion.div>
  );
}
