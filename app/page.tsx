import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import Header from './components/Header';

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection 
      title="Portfolio" 
      subtitle="設計から実装まで、まっすぐに" 
      
      />
      <AboutSection nameJa="富田 幸聖" nameEn="Kousei Tomita" />
    </div>
  );
}
