import { QRCodeConfig } from '../types'

interface BackendQRSettings {
  id: string
  streamer_id: string
  pixel_color: string
  background_color: string
  border_color: string
  logo_url: string
  logo_size: number
  logo_shape: string
  top_text: string
  bottom_text: string
  text_color: string
  text_size: string
  frame_style: string
  qr_size: number
  pixel_pattern: string
}

function toFrontend(data: BackendQRSettings): QRCodeConfig {
  return {
    pixelColor: data.pixel_color,
    backgroundColor: data.background_color,
    borderColor: data.border_color,
    logoUrl: data.logo_url || null,
    logoSize: data.logo_size,
    logoShape: data.logo_shape as QRCodeConfig['logoShape'],
    topText: data.top_text,
    bottomText: data.bottom_text,
    textColor: data.text_color,
    textSize: data.text_size as QRCodeConfig['textSize'],
    frameStyle: data.frame_style as QRCodeConfig['frameStyle'],
    qrSize: data.qr_size,
    pixelPattern: data.pixel_pattern as QRCodeConfig['pixelPattern'],
  }
}

function toBackend(config: QRCodeConfig) {
  return {
    pixel_color: config.pixelColor,
    background_color: config.backgroundColor,
    border_color: config.borderColor,
    logo_url: config.logoUrl || '',
    logo_size: config.logoSize,
    logo_shape: config.logoShape,
    top_text: config.topText,
    bottom_text: config.bottomText,
    text_color: config.textColor,
    text_size: config.textSize,
    frame_style: config.frameStyle,
    qr_size: config.qrSize,
    pixel_pattern: config.pixelPattern,
  }
}

export class QRSettingsService {
  static async getQRSettings(): Promise<QRCodeConfig | null> {
    const response = await fetch('/api/proxy/api/auth/qr-settings', {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch QR settings')
    }

    const data = await response.json()
    if (!data) return null
    return toFrontend(data)
  }

  static async saveQRSettings(config: QRCodeConfig): Promise<QRCodeConfig> {
    const response = await fetch('/api/proxy/api/auth/qr-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(toBackend(config)),
    })

    if (!response.ok) {
      throw new Error('Failed to save QR settings')
    }

    const data = await response.json()
    return toFrontend(data)
  }
}
