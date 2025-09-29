'use client'

import { useState } from 'react'
import { FloatingNavbar } from '../components/FloatingNavbar'
import { OverlayPreview } from '../components/OverlayPreview'
import { OverlaySettings } from '../components/OverlaySettings'
import { OverlayLinkCard } from '../components/OverlayLinkCard'

export default function OverlayPage() {
  const [overlayConfig, setOverlayConfig] = useState({
    showDonationAmount: true,
    showMessage: true,
    playSound: true,
    position: 'top' as 'top' | 'center' | 'bottom',
    duration: 5000,
    theme: 'default' as 'default' | 'minimal' | 'gaming'
  })

  const handleConfigChange = (newConfig: Partial<typeof overlayConfig>) => {
    setOverlayConfig(prev => ({ ...prev, ...newConfig }))
  }

  const overlayUrl = `https://app.givemoney.com/overlay/abc123?config=${btoa(JSON.stringify(overlayConfig))}`

  return (
    <div className="min-h-screen bg-pearl with-floating-navbar">
      <FloatingNavbar isLive={true} />

      <main className="dashboard-grid">
        {/* Page Header */}
        <div className="card-large mb-6">
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-electric-slate-900 mb-2">
              🎥 Configurar Overlay para Stream
            </h1>
            <p className="text-electric-slate-600">
              Configure e visualize como as doações aparecerão na sua stream
            </p>
          </div>
        </div>

        {/* Preview and Settings */}
        <div className="card-medium">
          <OverlayPreview config={overlayConfig} />
        </div>

        <div className="card-medium">
          <OverlaySettings
            config={overlayConfig}
            onConfigChange={handleConfigChange}
          />
        </div>

        {/* OBS Integration */}
        <div className="card-large">
          <OverlayLinkCard overlayUrl={overlayUrl} />
        </div>
      </main>
    </div>
  )
}