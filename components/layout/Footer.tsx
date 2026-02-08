import { TwitchLogo, DiscordLogo, XLogo } from "@phosphor-icons/react/dist/ssr"
import { siteConfig } from "@/lib/site-config"

const footerLinks = {
  product: [
    { label: "Features" },
    { label: "How It Works" },
  ],
  legal: [
    { label: "Privacy Policy" },
    { label: "Terms of Service" },
  ],
}

const socialLinks = [
  { label: "Twitter", icon: XLogo },
  { label: "Discord", icon: DiscordLogo },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="border-t border-gray-200"
      style={{ backgroundColor: "#FAFBFA" }}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <span
              className="inline-block mb-4 text-xl font-bold font-display"
              style={{ color: "#00A896" }}
            >
              GiveMeMoney
            </span>
            <p className="text-sm mb-4" style={{ color: "#5C665C" }}>
              Crypto donations for streamers. Zero fees, instant settlement.
            </p>
            <div aria-label="Social media">
              <ul className="flex gap-3">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <span
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200"
                      aria-label={social.label}
                    >
                      <social.icon
                        size={18}
                        weight="duotone"
                        style={{ color: "#5C665C" }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#1A1D1A" }}>
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <span
                    className="text-sm"
                    style={{ color: "#5C665C" }}
                  >
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <nav aria-label="Supported platforms">
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#1A1D1A" }}>
              Platforms
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm flex items-center gap-2" style={{ color: "#5C665C" }}>
                  <TwitchLogo size={16} weight="fill" className="text-[#9146FF]" />
                  Twitch
                </span>
              </li>
              <li>
                <span className="text-sm flex items-center gap-2" style={{ color: "#5C665C" }}>
                  <span className="w-4 h-4 rounded bg-[#53FC18] flex items-center justify-center">
                    <span className="font-bold text-black text-[8px]">K</span>
                  </span>
                  Kick
                </span>
              </li>
              <li>
                <span className="text-sm flex items-center gap-2" style={{ color: "#5C665C" }}>
                  <span className="w-4 h-4 rounded bg-[#FF0000] flex items-center justify-center">
                    <span className="text-white text-[8px]">▶</span>
                  </span>
                  YouTube
                </span>
              </li>
            </ul>
          </nav>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#1A1D1A" }}>
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <span
                    className="text-sm"
                    style={{ color: "#5C665C" }}
                  >
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{ color: "#8A938A" }}>
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: "#8A938A" }}>
            Made with care for streamers worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
