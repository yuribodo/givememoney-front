import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "../components/ErrorBoundary";
import { AuthErrorBoundary } from "../components/AuthErrorBoundary";
import { Navbar1 } from "../components/ui/navbar-1";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GiveMeMoney - Your Trusted Financial Companion",
  description: "Take control of your money with intelligent tracking, smart insights, and tools designed to help you save, invest, and grow your wealth—all in one beautiful app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: '#defcf8' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#defcf8' }}
      >
        <ErrorBoundary>
          <AuthErrorBoundary>
            <Navbar1 />
            {children}
          </AuthErrorBoundary>
        </ErrorBoundary>
      </body>
    </html>
  );
}
