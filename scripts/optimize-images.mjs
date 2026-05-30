/**
 * public 内の PNG を WebP に変換（品質・最大幅は用途別）。
 * 実行: node scripts/optimize-images.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.join(import.meta.dirname, '..', 'public');

/** @type {[string, string, number, number, boolean | undefined][]} */
const jobs = [
  // 線画ヒーローは tall viewport の cover 表示で拡大されるため、元 PNG より大きく出力する
  ['myline.png', 'myline.webp', 82, 2400, true],
  ['works/fream.png', 'works/fream.webp', 82, 1200],
  ['works/stride.png', 'works/stride.webp', 82, 1200],
  ['works/tankore.png', 'works/tankore.webp', 82, 1200],
  ['icons/search.png', 'icons/search.webp', 85, 64],
];

for (const [srcName, outName, quality, maxWidth, allowEnlarge] of jobs) {
  const inPath = path.join(ROOT, srcName);
  const outPath = path.join(ROOT, outName);
  if (!fs.existsSync(inPath)) {
    console.warn('skip (missing):', srcName);
    continue;
  }
  await sharp(inPath)
    .resize({ width: maxWidth, withoutEnlargement: !allowEnlarge })
    .webp({ quality })
    .toFile(outPath);
  const inKb = Math.round(fs.statSync(inPath).size / 1024);
  const outKb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`${srcName} → ${outName}: ${inKb}K → ${outKb}K`);
}
