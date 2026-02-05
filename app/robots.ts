import { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/overlay/", "/layout/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
