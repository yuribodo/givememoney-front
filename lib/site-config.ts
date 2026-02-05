export const siteConfig = {
  name: "GiveMeMoney",
  description:
    "Accept crypto donations on your stream instantly. Connect your wallet, add the overlay to OBS, and receive BTC, ETH, SOL donations with zero platform fees.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://givememoney.fun",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/givememoney",
    discord: "https://discord.gg/givememoney",
  },
  creator: "GiveMeMoney Team",
} as const

export type SiteConfig = typeof siteConfig
