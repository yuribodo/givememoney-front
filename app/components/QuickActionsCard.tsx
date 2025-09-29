'use client'

import { useState } from 'react'
import { Rocket, Copy, QrCode, CheckCircle, Monitor } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface QuickActionsCardProps {
  onShareClick?: () => void
}

export function QuickActionsCard({ onShareClick }: QuickActionsCardProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const shareLink = 'givemoney.com/u/seuusername'

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      onShareClick?.()

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleQRCode = () => {
    setShowQR(!showQR)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Rocket size={20} weight="duotone" className="text-cyber-mint-500" />
          QUICK SHARE
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Share Link */}
        <div className="space-y-3">
          <div className="p-3 bg-electric-slate-50 rounded-lg border">
            <div className="money-display text-sm text-electric-slate-700 break-all">
              {shareLink}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCopyLink}
              variant={copied ? "default" : "outline"}
              className="flex items-center gap-2"
              disabled={copied}
            >
              {copied ? (
                <>
                  <CheckCircle size={16} weight="duotone" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy size={16} weight="duotone" />
                  Copy Link
                </>
              )}
            </Button>

            <Button
              onClick={handleQRCode}
              variant="outline"
              className="flex items-center gap-2"
            >
              <QrCode size={16} weight="duotone" />
              QR Code
            </Button>
          </div>
        </div>

        {/* QR Code Preview */}
        {showQR && (
          <div className="p-4 bg-white border rounded-lg text-center">
            <div className="w-32 h-32 mx-auto bg-electric-slate-100 rounded-lg flex items-center justify-center mb-2">
              <QrCode size={48} weight="duotone" className="text-electric-slate-400" />
            </div>
            <div className="text-xs text-electric-slate-600">
              QR Code para {shareLink}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-success-emerald/5 rounded-lg border border-success-emerald/20">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} weight="fill" className="text-success-emerald" />
            <span className="text-sm font-medium text-success-emerald">Status: Funcionando</span>
          </div>
        </div>

        {/* Quick Overlay Access */}
        <div className="pt-2 border-t border-electric-slate-200">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-2 text-electric-slate-600 hover:text-electric-slate-900"
            onClick={() => window.location.href = '/overlay'}
          >
            <Monitor size={16} weight="duotone" />
            Configurar Overlay
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}