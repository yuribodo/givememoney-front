import type { Metadata } from "next"
import { HeroSection, ValuePropsSection, FinalCTASection } from '@/features/marketing'
import { SectionDivider } from '@/components/ui/section-divider'

export const metadata: Metadata = {
  title: "Crypto Donations for Streamers - Accept BTC, ETH, SOL",
  description:
    "Accept crypto donations on your Twitch or Kick stream instantly. Connect MetaMask or Phantom, add the overlay to OBS, and start receiving Bitcoin, Ethereum, and Solana donations with zero fees.",
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  return (
    <main
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
    </main>
  );
}
