import { ImageResponse } from "next/og"
import { ICON_DATA_URI } from "./icon-svg"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#00A896",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "32px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ICON_DATA_URI} alt="" width={120} height={120} />
      </div>
    ),
    {
      ...size,
    }
  )
}
