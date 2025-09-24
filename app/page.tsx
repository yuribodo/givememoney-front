import { HeroSection } from './components/HeroSection'
import { QuickSetupSection } from './components/QuickSetupSection'
import { PlatformSection } from './components/PlatformSection'
import { FinalCTASection } from './components/FinalCTASection'

export default function Home() {
  return (
    <div className="min-h-screen font-body text-electric-slate-900">
      <HeroSection />
      <QuickSetupSection />
      <PlatformSection />
      <FinalCTASection />
    </div>
  );
}
