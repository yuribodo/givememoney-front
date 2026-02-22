import { ImageResponse } from "next/og"
import { ICON_DATA_URI } from "./icon-svg"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default function Icon() {
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
          borderRadius: "6px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ICON_DATA_URI} alt="" width={22} height={22} />
      </div>
    ),
    {
      ...size,
    }
  )
}
