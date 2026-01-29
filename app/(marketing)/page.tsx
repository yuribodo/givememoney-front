import { HeroSection, ValuePropsSection, FinalCTASection } from '@/features/marketing'
import { SectionDivider } from '@/components/ui/section-divider'

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
      <SectionDivider variant="wave" accentLine fromColor="#FAFBFA" toColor="#FAFBFA" />
      <ValuePropsSection />
      <FinalCTASection />
    </div>
  );
}
