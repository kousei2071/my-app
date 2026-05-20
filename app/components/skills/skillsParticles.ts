import { N_PARTICLES } from './skillsConfig';

export type Particle = {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  rot: number;
  scale: number;
  size: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** カード矩形の上にランダム配置し、バースト先の transform 値を持つ */
export function buildParticles(box: DOMRect, cards: DOMRect[]): Particle[] {
  const rects = cards.length > 0 ? cards : [box];

  return Array.from({ length: N_PARTICLES }, (_, id) => {
    const r = rects[id % rects.length];
    return {
      id,
      x: r.left - box.left + r.width * Math.random(),
      y: r.top - box.top + r.height * Math.random(),
      tx: rand(-220, 220),
      ty: rand(-160, 160),
      rot: rand(-540, 540),
      scale: rand(0.15, 0.85),
      size: rand(4, 9),
    };
  });
}
