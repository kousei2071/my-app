import Header from './components/Header';
import { AboutJourneyRow, AboutScrollStage } from './components/about/home';
import { HeroSection } from './components/hero';
import SkillsDeferred from './components/skills/SkillsDeferred';
import WorksSection from './components/works/WorksSection';

export default function Home() {
  return (
    <div id="page-root">
      <Header />
      <HeroSection title="Portfolio" subtitle="設計から実装まで、まっすぐに" />
      <AboutScrollStage>
        <AboutJourneyRow nameJa="富田 幸聖" nameEn="Kousei Tomita" />
      </AboutScrollStage>
      <WorksSection />
      <SkillsDeferred />
    </div>
  );
}
