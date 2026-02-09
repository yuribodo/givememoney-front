import { AlertConfig } from '../types'

interface BackendAlertSettings {
  id: string
  streamer_id: string
  background_color: string
  text_color: string
  message_color: string
  accent_color: string
  header_text: string
  show_donor_name: boolean
  show_amount: boolean
  show_message: boolean
  min_duration: number
  max_duration: number
  sound_enabled: boolean
  position: string
}

function toFrontend(data: BackendAlertSettings): AlertConfig {
  return {
    backgroundColor: data.background_color,
    textColor: data.text_color,
    messageColor: data.message_color,
    accentColor: data.accent_color,
    headerText: data.header_text,
    showDonorName: data.show_donor_name,
    showAmount: data.show_amount,
    showMessage: data.show_message,
    minDuration: data.min_duration,
    maxDuration: data.max_duration,
    soundEnabled: data.sound_enabled,
    position: (data.position as AlertConfig['position']) || 'top',
  }
}

function toBackend(config: AlertConfig) {
  return {
    background_color: config.backgroundColor,
    text_color: config.textColor,
    message_color: config.messageColor,
    accent_color: config.accentColor,
    header_text: config.headerText,
    show_donor_name: config.showDonorName,
    show_amount: config.showAmount,
    show_message: config.showMessage,
    min_duration: config.minDuration,
    max_duration: config.maxDuration,
    sound_enabled: config.soundEnabled,
    position: config.position,
  }
}

export class AlertSettingsService {
  static async getAlertSettings(): Promise<AlertConfig | null> {
    const response = await fetch('/api/proxy/api/auth/alert-settings', {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch alert settings')
    }

    const data = await response.json()
    if (!data) return null
    return toFrontend(data)
  }

  static async saveAlertSettings(config: AlertConfig): Promise<AlertConfig> {
    const response = await fetch('/api/proxy/api/auth/alert-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(toBackend(config)),
    })

    if (!response.ok) {
      throw new Error('Failed to save alert settings')
    }

    const data = await response.json()
    return toFrontend(data)
  }
}
