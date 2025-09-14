import { HeroSection } from './components/HeroSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { FinalCTASection } from './components/FinalCTASection'
import { Navbar1 } from '../components/ui/navbar-1'

export default function Home() {
  return (
    <div className="min-h-screen font-body text-electric-slate-900">
      <Navbar1 />
      <HeroSection />
      <HowItWorksSection />
      <FinalCTASection />
    </div>
  );
}
