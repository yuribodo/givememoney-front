import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "GiveMeMoney - Crypto Donations for Streamers"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFBFA",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgba(0, 168, 150, 0.08)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px",
            position: "relative",
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              backgroundColor: "#00A896",
              borderRadius: 16,
              marginBottom: 40,
              fontSize: 48,
              color: "white",
              fontWeight: 700,
            }}
          >
            $
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#1A1D1A",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            Crypto donations
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#00A896",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 40,
            }}
          >
            made instant.
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 28,
              color: "#5C665C",
              maxWidth: 700,
            }}
          >
            Accept BTC, ETH, SOL on your stream with zero fees
          </div>

          {/* Supported platforms */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              marginTop: 48,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#8A938A",
                fontSize: 18,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: "#9146FF",
                }}
              />
              Twitch
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#8A938A",
                fontSize: 18,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: "#53FC18",
                }}
              />
              Kick
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#8A938A",
                fontSize: 18,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: "#FF0000",
                }}
              />
              YouTube
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
