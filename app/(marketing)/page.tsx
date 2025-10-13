import { HeroSection, FinalCTASection } from '@/features/marketing'
import { QuickSetupSection, PlatformSection } from '@/features/dashboard'

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
