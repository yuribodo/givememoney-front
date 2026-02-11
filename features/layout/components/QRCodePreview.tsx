'use client'

import { QRCodeConfig } from '../types'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodePreviewProps {
  config: QRCodeConfig
  donationUrl?: string
}

export function QRCodePreview({ config, donationUrl = 'https://givememoney.fun' }: QRCodePreviewProps) {
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
    <div className="relative w-full min-h-[420px] flex items-center justify-center overflow-hidden rounded-xl bg-[#f8f9fa]">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, #c8ccd0 0.8px, transparent 0.8px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* QR Code content */}
      <div className="relative z-10 flex flex-col items-center gap-3 py-8">
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
          className={`relative p-5 transition-all duration-200 ${frameStyles[config.frameStyle]}`}
          style={{
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
            borderWidth: config.frameStyle !== 'none' ? '3px' : '0',
            borderStyle: 'solid',
          }}
        >
          <div className="relative">
            <QRCodeSVG
              value={donationUrl}
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
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 ${
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
