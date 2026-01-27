import { HeroSection, ValuePropsSection, FinalCTASection } from '@/features/marketing'

export default function Home() {
  return (
    <div
      className="min-h-screen font-body"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      <HeroSection />
      <ValuePropsSection />
      <FinalCTASection />
    </div>
  );
}
