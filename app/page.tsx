import HeroSection from './components/HeroSection';
import AboutScrollStage from './components/AboutScrollStage';
import AboutJourneyRow from './components/AboutJourneyRow';
import Header from './components/Header';

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection 
      title="Portfolio" 
      subtitle="設計から実装まで、まっすぐに" 
      
      />
      <AboutScrollStage>
        <AboutJourneyRow nameJa="富田 幸聖" nameEn="Kousei Tomita" />
      </AboutScrollStage>
    </div>
  );
}
