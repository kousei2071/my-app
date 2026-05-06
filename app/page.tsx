import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';

export default function Home() {
  return (
    <div>
      <HeroSection 
      title="Portfolio" 
      subtitle="設計から実装まで、まっすぐに" 
      />
      <AboutSection />
    </div>
  );
}
