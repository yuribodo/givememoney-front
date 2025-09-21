import { HeroSection } from './components/HeroSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { FinalCTASection } from './components/FinalCTASection'

export default function Home() {
  return (
    <div className="min-h-screen font-body text-electric-slate-900">
      <HeroSection />
      <HowItWorksSection />
      <FinalCTASection />
    </div>
  );
}
