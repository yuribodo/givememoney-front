export interface AlertConfig {
  // Colors
  backgroundColor: string
  textColor: string
  messageColor: string
  accentColor: string

  // Logo
  logoUrl: string | null
  logoPosition: 'left' | 'center' | 'right' | 'none'
  logoSize: 'small' | 'medium' | 'large'

  // Content
  headerText: string
  showDonorName: boolean
  showAmount: boolean
  showMessage: boolean

  // Style
  style: 'minimal' | 'gaming' | 'neon' | 'glassmorphism'
  duration: number // in milliseconds
  soundEnabled: boolean
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
