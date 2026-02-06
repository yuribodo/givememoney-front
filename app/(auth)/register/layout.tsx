import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join GiveMeMoney and start accepting crypto donations on your stream. Free to use with zero platform fees.",
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
