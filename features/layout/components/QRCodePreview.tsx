'use client'

import { QRCodeConfig } from '../types'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodePreviewProps {
  config: QRCodeConfig
}

export function QRCodePreview({ config }: QRCodePreviewProps) {
  const frameStyles = {
    none: '',
    rounded: 'rounded-3xl',
    square: 'rounded-none',
    neon: 'rounded-2xl shadow-[0_0_30px_rgba(0,171,150,0.6)]',
  }

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl',
  }

  return (
    <div className="w-full flex items-center justify-center p-8 bg-electric-slate-50 rounded-xl">
      <div className="flex flex-col items-center gap-4">
        {/* Top Text */}
        {config.topText && (
          <p
            className={`font-bold ${textSizes[config.textSize]}`}
            style={{ color: config.textColor }}
          >
            {config.topText}
          </p>
        )}

        {/* QR Code Container */}
        <div
          className={`relative p-6 ${frameStyles[config.frameStyle]}`}
          style={{
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
            borderWidth: config.frameStyle !== 'none' ? '4px' : '0',
          }}
        >
          {/* QR Code */}
          <div className="relative">
            <QRCodeSVG
              value="https://givememoney.fun/donate/user123"
              size={config.qrSize}
              bgColor={config.backgroundColor}
              fgColor={config.pixelColor}
              level="H"
              includeMargin={false}
              style={{
                borderRadius: config.pixelPattern === 'rounded' ? '4px' : '0',
              }}
            />

            {/* Logo Overlay */}
            {config.logoUrl && (
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 ${
                  config.logoShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                }`}
                style={{
                  width: `${(config.qrSize * config.logoSize) / 100}px`,
                  height: `${(config.qrSize * config.logoSize) / 100}px`,
                }}
              >
                <img
                  src={config.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Text */}
        {config.bottomText && (
          <p
            className={`font-semibold ${textSizes[config.textSize]}`}
            style={{ color: config.textColor }}
          >
            {config.bottomText}
          </p>
        )}
      </div>
    </div>
  )
}
