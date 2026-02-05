import { ConditionalNavbar } from '@/components/layout/ConditionalNavbar'
import { Footer } from '@/components/layout/Footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ConditionalNavbar />
      {children}
      <Footer />
    </>
  )
}