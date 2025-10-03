'use client'

import { AlertConfig } from '../types'
import { ColorPicker } from './ColorPicker'
import { LogoUploader } from './LogoUploader'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AlertCustomizerProps {
  config: AlertConfig
  onChange: (config: Partial<AlertConfig>) => void
}

export function AlertCustomizer({ config, onChange }: AlertCustomizerProps) {
  return (
    <div className="space-y-6">
      {/* Colors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎨 Cores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPicker
            label="Cor de Fundo"
            value={config.backgroundColor}
            onChange={(color) => onChange({ backgroundColor: color })}
          />
          <ColorPicker
            label="Cor do Texto Principal"
            value={config.textColor}
            onChange={(color) => onChange({ textColor: color })}
          />
          <ColorPicker
            label="Cor da Mensagem"
            value={config.messageColor}
            onChange={(color) => onChange({ messageColor: color })}
          />
          <ColorPicker
            label="Cor de Destaque/Borda"
            value={config.accentColor}
            onChange={(color) => onChange({ accentColor: color })}
          />
        </CardContent>
      </Card>

      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🖼️ Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LogoUploader
            label="Upload da Logo"
            value={config.logoUrl}
            onChange={(url) => onChange({ logoUrl: url })}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Posição da Logo</Label>
            <select
              value={config.logoPosition}
              onChange={(e) => onChange({ logoPosition: e.target.value as AlertConfig['logoPosition'] })}
              className="w-full px-3 py-2 rounded-lg border border-electric-slate-300 bg-white text-electric-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-mint-500"
            >
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
              <option value="none">Sem Logo</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Tamanho da Logo</Label>
            <select
              value={config.logoSize}
              onChange={(e) => onChange({ logoSize: e.target.value as AlertConfig['logoSize'] })}
              className="w-full px-3 py-2 rounded-lg border border-electric-slate-300 bg-white text-electric-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-mint-500"
            >
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💬 Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Texto de Cabeçalho</Label>
            <Input
              value={config.headerText}
              onChange={(e) => onChange({ headerText: e.target.value })}
              placeholder="💰 Nova Doação!"
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showDonorName"
              checked={config.showDonorName}
              onChange={(e) => onChange({ showDonorName: e.target.checked })}
              className="w-5 h-5 rounded border-electric-slate-300 text-cyber-mint-600 focus:ring-cyber-mint-500 cursor-pointer"
            />
            <Label htmlFor="showDonorName" className="text-sm font-medium text-electric-slate-700 cursor-pointer">
              Mostrar Nome do Doador
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showAmount"
              checked={config.showAmount}
              onChange={(e) => onChange({ showAmount: e.target.checked })}
              className="w-5 h-5 rounded border-electric-slate-300 text-cyber-mint-600 focus:ring-cyber-mint-500 cursor-pointer"
            />
            <Label htmlFor="showAmount" className="text-sm font-medium text-electric-slate-700 cursor-pointer">
              Mostrar Valor
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showMessage"
              checked={config.showMessage}
              onChange={(e) => onChange({ showMessage: e.target.checked })}
              className="w-5 h-5 rounded border-electric-slate-300 text-cyber-mint-600 focus:ring-cyber-mint-500 cursor-pointer"
            />
            <Label htmlFor="showMessage" className="text-sm font-medium text-electric-slate-700 cursor-pointer">
              Mostrar Mensagem do Doador
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Style Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">✨ Estilo e Animação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">Estilo do Alerta</Label>
            <select
              value={config.style}
              onChange={(e) => onChange({ style: e.target.value as AlertConfig['style'] })}
              className="w-full px-3 py-2 rounded-lg border border-electric-slate-300 bg-white text-electric-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-mint-500"
            >
              <option value="minimal">Minimal</option>
              <option value="gaming">Gaming</option>
              <option value="neon">Neon</option>
              <option value="glassmorphism">Glassmorphism</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-electric-slate-700">
              Duração do Alerta: {config.duration / 1000}s
            </Label>
            <input
              type="range"
              min="3000"
              max="10000"
              step="1000"
              value={config.duration}
              onChange={(e) => onChange({ duration: parseInt(e.target.value) })}
              className="w-full h-2 bg-electric-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="soundEnabled"
              checked={config.soundEnabled}
              onChange={(e) => onChange({ soundEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-electric-slate-300 text-cyber-mint-600 focus:ring-cyber-mint-500 cursor-pointer"
            />
            <Label htmlFor="soundEnabled" className="text-sm font-medium text-electric-slate-700 cursor-pointer">
              Habilitar Efeito Sonoro
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        className="w-full cursor-pointer hover:scale-105 transition-transform"
        variant="auth"
        size="lg"
      >
        Salvar Configurações
      </Button>
    </div>
  )
}
