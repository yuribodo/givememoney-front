import { siteConfig } from "@/lib/site-config"

type JsonLdType = "Organization" | "WebPage" | "SoftwareApplication" | "FAQPage"

interface JsonLdProps {
  type: JsonLdType
  data?: Record<string, unknown>
}

export function JsonLd({ type, data }: JsonLdProps) {
  const baseStructuredData = {
    "@context": "https://schema.org",
  }

  let structuredData: Record<string, unknown>

  switch (type) {
    case "Organization":
      structuredData = {
        ...baseStructuredData,
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        sameAs: [siteConfig.links.twitter, siteConfig.links.discord].filter(
          Boolean
        ),
        ...data,
      }
      break

    case "WebPage":
      structuredData = {
        ...baseStructuredData,
        "@type": "WebPage",
        name: data?.name || siteConfig.name,
        description: data?.description || siteConfig.description,
        url: data?.url || siteConfig.url,
        isPartOf: {
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        ...data,
      }
      break

    case "SoftwareApplication":
      structuredData = {
        ...baseStructuredData,
        "@type": "SoftwareApplication",
        name: siteConfig.name,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: siteConfig.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free to use with zero platform fees",
        },
        featureList: [
          "Crypto donations",
          "OBS overlay integration",
          "Multi-chain support (Bitcoin, Ethereum, Solana)",
          "Real-time alerts",
          "Zero platform fees",
        ],
        ...data,
      }
      break

    case "FAQPage":
      structuredData = {
        ...baseStructuredData,
        "@type": "FAQPage",
        mainEntity: data?.questions || [],
      }
      break

    default:
      structuredData = baseStructuredData
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
