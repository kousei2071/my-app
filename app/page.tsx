import dynamic from 'next/dynamic';
import Header from './components/Header';
import { AboutJourneyRow, AboutScrollStage } from './components/about/home';
import { HeroSection } from './components/hero';
import WorksSection from './components/works/WorksSection';

const SkillsSection = dynamic(() => import('./components/skills/SkillsSection'), {
  loading: () => (
    <section id="skills" className="min-h-[50vh]" aria-hidden="true" />
  ),
});

export default function Home() {
  return (
    <div id="page-root">
      <Header />
      <HeroSection title="Portfolio" subtitle="設計から実装まで、まっすぐに" />
      <AboutScrollStage>
        <AboutJourneyRow nameJa="富田 幸聖" nameEn="Kousei Tomita" />
      </AboutScrollStage>
      <WorksSection />
      <SkillsSection />
    </div>
  );
}
