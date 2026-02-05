import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your GiveMeMoney account to manage your crypto donation settings and view your earnings.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
