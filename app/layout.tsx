import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthErrorBoundary } from "@/features/auth";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Crypto Donations for Streamers`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "crypto donations",
    "streamer donations",
    "twitch donations",
    "kick donations",
    "bitcoin donations",
    "ethereum donations",
    "solana donations",
    "obs overlay",
    "streaming tips",
    "web3 donations",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Crypto Donations for Streamers`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "GiveMeMoney - Accept crypto donations on your stream",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Crypto Donations for Streamers`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@givememoney",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: '#defcf8' }}>
      <head>
        <JsonLd type="Organization" />
        <JsonLd type="SoftwareApplication" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#defcf8' }}
      >
        <ErrorBoundary>
          <AuthErrorBoundary>
            {children}
          </AuthErrorBoundary>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
