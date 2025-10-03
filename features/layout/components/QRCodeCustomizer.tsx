'use client'

import { QRCodeConfig } from '../types'
import { ColorPicker } from './ColorPicker'
import { LogoUploader } from './LogoUploader'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from '@phosphor-icons/react'

interface QRCodeCustomizerProps {
  config: QRCodeConfig
  onChange: (config: Partial<QRCodeConfig>) => void
}

export function QRCodeCustomizer({ config, onChange }: QRCodeCustomizerProps) {
  const handleDownload = () => {
    // TODO: Implement QR Code download functionality
    alert('Funcionalidade de download será implementada em breve!')
  }

  return (
    <div className="space-y-6">
      {/* Colors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎨 Cores do QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPicker
            label="Cor dos Pixels"
            value={config.pixelColor}
            onChange={(color) => onChange({ pixelColor: color })}
          />
          <ColorPicker
            label="Cor de Fundo"
            value={config.backgroundColor}
            onChange={(color) => onChange({ backgroundColor: color })}
          />
          <ColorPicker
            label="Cor da Borda"
            value={config.borderColor}
            onChange={(color) => onChange({ borderColor: color })}
          />
        </CardContent>
      </Card>

      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🖼️ Logo Central</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LogoUploader
            label="Upload da Logo"
            value={config.logoUrl}
            onChange={(url) => onChange({ logoUrl: url })}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">
              Tamanho da Logo: {config.logoSize}%
            </Label>
            <input
              type="range"
              min="10"
              max="30"
              step="5"
              value={config.logoSize}
              onChange={(e) => onChange({ logoSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-electric-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-electric-slate-500">
              Tamanho ideal: 15-25% para não comprometer a leitura do QR Code
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Formato da Logo</Label>
            <select
              value={config.logoShape}
              onChange={(e) => onChange({ logoShape: e.target.value as QRCodeConfig['logoShape'] })}
              className="w-full px-3 py-2 rounded-lg border border-electric-slate-300 bg-white text-electric-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-mint-500"
            >
              <option value="circle">Círculo</option>
              <option value="square">Quadrado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Text Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💬 Textos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Texto Superior</Label>
            <Input
              value={config.topText}
              onChange={(e) => onChange({ topText: e.target.value })}
              placeholder="Doe Agora!"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Texto Inferior</Label>
            <Input
              value={config.bottomText}
              onChange={(e) => onChange({ bottomText: e.target.value })}
              placeholder="@seucanal"
              className="w-full"
            />
          </div>

          <ColorPicker
            label="Cor do Texto"
            value={config.textColor}
            onChange={(color) => onChange({ textColor: color })}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Tamanho da Fonte</Label>
            <select
              value={config.textSize}
              onChange={(e) => onChange({ textSize: e.target.value as QRCodeConfig['textSize'] })}
              className="w-full px-3 py-2 rounded-lg border border-electric-slate-300 bg-white text-electric-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-mint-500"
            >
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Style Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">✨ Estilo Visual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Estilo da Moldura</Label>
            <select
              value={config.frameStyle}
              onChange={(e) => onChange({ frameStyle: e.target.value as QRCodeConfig['frameStyle'] })}
              className="w-full px-3 py-2 rounded-lg border border-electric-slate-300 bg-white text-electric-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-mint-500"
            >
              <option value="none">Sem Moldura</option>
              <option value="rounded">Arredondada</option>
              <option value="square">Quadrada</option>
              <option value="neon">Neon</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">
              Tamanho do QR Code: {config.qrSize}px
            </Label>
            <input
              type="range"
              min="200"
              max="600"
              step="50"
              value={config.qrSize}
              onChange={(e) => onChange({ qrSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-electric-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Padrão dos Pixels</Label>
            <select
              value={config.pixelPattern}
              onChange={(e) => onChange({ pixelPattern: e.target.value as QRCodeConfig['pixelPattern'] })}
              className="w-full px-3 py-2 rounded-lg border border-electric-slate-300 bg-white text-electric-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-mint-500"
            >
              <option value="square">Quadrado</option>
              <option value="rounded">Arredondado</option>
              <option value="dots">Pontos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleDownload}
          className="w-full cursor-pointer hover:scale-105 transition-transform bg-gradient-to-r from-warm-coral-600 to-warm-coral-700 text-white hover:from-warm-coral-700 hover:to-warm-coral-800"
          size="lg"
        >
          <Download size={20} weight="duotone" />
          Baixar QR Code
        </Button>

        <Button
          className="w-full cursor-pointer hover:scale-105 transition-transform"
          variant="auth"
          size="lg"
        >
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
