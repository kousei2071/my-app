import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';

export default function Home() {
  return (
    <div>
      <HeroSection 
      title="Portfolio" 
      subtitle="Simple & Minimal Design" 
      />
      <AboutSection />
    </div>
  );
}
