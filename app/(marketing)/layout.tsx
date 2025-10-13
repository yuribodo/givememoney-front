import { ConditionalNavbar } from '@/components/layout/ConditionalNavbar'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ConditionalNavbar />
      {children}
    </>
  )
}