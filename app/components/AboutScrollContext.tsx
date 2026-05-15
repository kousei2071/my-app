'use client';

import { createContext, useContext } from 'react';

/** ステージ内なら progress、外なら null（従来レイアウト） */
export const AboutScrollContext = createContext<{ progress: number } | null>(null);

export function useAboutScrollStage(): { progress: number } | null {
  return useContext(AboutScrollContext);
}
