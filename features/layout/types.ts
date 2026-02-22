export interface AlertConfig {
  // Colors
  backgroundColor: string
  textColor: string
  messageColor: string
  accentColor: string

  // Content
  headerText: string
  showDonorName: boolean
  showAmount: boolean
  showMessage: boolean

  // Animation
  minDuration: number // in milliseconds
  maxDuration: number // in milliseconds
  soundEnabled: boolean

  // Position
  position: 'top' | 'center' | 'bottom'
}

export interface QRCodeConfig {
  // Colors
  pixelColor: string
  backgroundColor: string
  borderColor: string

  // Logo
  logoUrl: string | null
  logoSize: number // 10-30% of QR size
  logoShape: 'circle' | 'square'

  // Text
  topText: string
  bottomText: string
  textColor: string
  textSize: 'small' | 'medium' | 'large'

  // Style
  frameStyle: 'none' | 'rounded' | 'square' | 'neon'
  qrSize: number // 200-600px
  pixelPattern: 'square' | 'rounded' | 'dots'
}
