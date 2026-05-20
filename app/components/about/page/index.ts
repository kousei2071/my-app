/**
 * /about 詳細ページ
 *
 * profile/ … 第1章 About（プロフィール）— content/profileMeta.ts で右カラムを編集
 * bridge/  … プロフィール ↔ 経歴のスクロール橋渡し
 * career/  … 第2章 経歴 + 理念・資格 — content/*.ts で文言を編集
 */

export { default as AboutDetailView } from './AboutDetailView';

export { PROFILE_META } from './profile/content/profileMeta';
export { careerMilestones, type CareerMilestone } from './career/content/careerMilestones';
export { philosophyContent, type PhilosophyItem } from './career/content/philosophyContent';
export { credentials, type Credential } from './career/content/credentialsContent';
