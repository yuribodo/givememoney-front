'use client'

import { useState } from 'react'
import { Monitor, Play } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OverlayConfig {
  showDonationAmount: boolean
  showMessage: boolean
  playSound: boolean
  position: 'top' | 'center' | 'bottom'
  duration: number
  theme: 'default' | 'minimal' | 'gaming'
}

interface OverlayPreviewProps {
  config: OverlayConfig
}

export function OverlayPreview({ config }: OverlayPreviewProps) {
  const [showDonation, setShowDonation] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const mockDonation = {
    username: '@viewer123',
    amount: 25.00,
    currency: 'SOL',
    message: 'Amazing stream! Keep it up! 🚀'
  }

  const simulateDonation = () => {
    setIsPlaying(true)
    setShowDonation(true)

    setTimeout(() => {
      setShowDonation(false)
      setIsPlaying(false)
    }, config.duration)
  }

  const getPositionClasses = () => {
    switch (config.position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2'
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2'
      default:
        return 'top-4 left-1/2 transform -translate-x-1/2'
    }
  }

  const getThemeClasses = () => {
    switch (config.theme) {
      case 'minimal':
        return 'bg-white/90 text-black border border-gray-200'
      case 'gaming':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0'
      default:
        return 'bg-cyber-mint-600 text-white border-0'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Monitor size={20} weight="duotone" className="text-cyber-mint-500" />
          PREVIEW
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stream Preview Container */}
        <div className="relative bg-gradient-to-br from-electric-slate-900 to-electric-slate-800 rounded-lg aspect-video overflow-hidden">
          {/* Fake stream content */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
            <div className="absolute bottom-4 left-4 text-white/60 text-sm">
              Simulação da sua stream
            </div>
          </div>

          {/* Donation Overlay */}
          {showDonation && (
            <div
              className={`absolute ${getPositionClasses()} animate-scale-in z-10`}
            >
              <div
                className={`px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm ${getThemeClasses()}`}
              >
                <div className="text-center space-y-2">
                  <div className="text-sm font-medium opacity-90">
                    Nova doação!
                  </div>

                  <div className="font-bold text-lg">
                    {mockDonation.username}
                  </div>

                  {config.showDonationAmount && (
                    <div className="text-xl font-bold">
                      ◎ ${mockDonation.amount.toFixed(2)} {mockDonation.currency}
                    </div>
                  )}

                  {config.showMessage && mockDonation.message && (
                    <div className="text-sm opacity-90 max-w-xs">
                      &ldquo;{mockDonation.message}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button
            onClick={simulateDonation}
            disabled={isPlaying}
            className="flex items-center gap-2"
          >
            <Play size={16} weight="duotone" />
            {isPlaying ? 'Simulando...' : 'Testar Overlay'}
          </Button>

          <div className="text-sm text-electric-slate-600">
            Duração: {config.duration / 1000}s | Posição: {config.position}
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="p-3 bg-electric-slate-50 rounded-lg">
          <div className="text-sm font-medium text-electric-slate-700 mb-2">
            Configuração Atual:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-electric-slate-600">
            <div>
              ✓ Valor: {config.showDonationAmount ? 'Visível' : 'Oculto'}
            </div>
            <div>
              ✓ Mensagem: {config.showMessage ? 'Visível' : 'Oculta'}
            </div>
            <div>
              ✓ Som: {config.playSound ? 'Ativado' : 'Desativado'}
            </div>
            <div>
              ✓ Tema: {config.theme}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}