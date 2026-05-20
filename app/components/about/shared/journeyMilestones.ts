/**
 * トップページ「これまでの道」用（/about の経歴は page/career/content/careerMilestones.ts を編集）
 */

import { careerMilestones, type CareerMilestone } from '../page/career/content/careerMilestones';

export type Milestone = Pick<CareerMilestone, 'id' | 'period' | 'title' | 'description'>;

export const journeyMilestones: Milestone[] = careerMilestones.map(
  ({ id, period, title, description }) => ({ id, period, title, description }),
);
