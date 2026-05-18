import HeroSection from './components/HeroSection';
import Header from './components/Header';
import { AboutJourneyRow, AboutScrollStage } from './components/about';
import SkillsSection from './components/skills/SkillsSection';
import WorksSection from './components/works/WorksSection';

export default function Home() {
  return (
    <div>
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
