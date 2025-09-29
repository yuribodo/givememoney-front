import { Gear } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface OverlayConfig {
  showDonationAmount: boolean
  showMessage: boolean
  playSound: boolean
  position: 'top' | 'center' | 'bottom'
  duration: number
  theme: 'default' | 'minimal' | 'gaming'
}

interface OverlaySettingsProps {
  config: OverlayConfig
  onConfigChange: (newConfig: Partial<OverlayConfig>) => void
}

export function OverlaySettings({ config, onConfigChange }: OverlaySettingsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Gear size={20} weight="duotone" className="text-cyber-mint-500" />
          CONFIGURAÇÕES
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Display Options */}
        <div className="space-y-4">
          <div className="font-medium text-electric-slate-900">Exibição</div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showDonationAmount}
                onChange={(e) => onConfigChange({ showDonationAmount: e.target.checked })}
                className="w-4 h-4 text-cyber-mint-600 bg-gray-100 border-gray-300 rounded focus:ring-cyber-mint-500"
              />
              <span className="text-sm text-electric-slate-700">
                Mostrar valor da doação
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showMessage}
                onChange={(e) => onConfigChange({ showMessage: e.target.checked })}
                className="w-4 h-4 text-cyber-mint-600 bg-gray-100 border-gray-300 rounded focus:ring-cyber-mint-500"
              />
              <span className="text-sm text-electric-slate-700">
                Mostrar mensagem do doador
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.playSound}
                onChange={(e) => onConfigChange({ playSound: e.target.checked })}
                className="w-4 h-4 text-cyber-mint-600 bg-gray-100 border-gray-300 rounded focus:ring-cyber-mint-500"
              />
              <span className="text-sm text-electric-slate-700">
                Som de notificação
              </span>
            </label>
          </div>
        </div>

        {/* Position */}
        <div className="space-y-4">
          <Label className="font-medium text-electric-slate-900">Posição na Tela</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'top', label: 'Topo' },
              { value: 'center', label: 'Centro' },
              { value: 'bottom', label: 'Base' }
            ].map((position) => (
              <label key={position.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="position"
                  value={position.value}
                  checked={config.position === position.value}
                  onChange={(e) => onConfigChange({ position: e.target.value as 'top' | 'center' | 'bottom' })}
                  className="sr-only"
                />
                <div
                  className={`p-3 text-center text-sm rounded-lg border-2 transition-all ${
                    config.position === position.value
                      ? 'border-cyber-mint-500 bg-cyber-mint-50 text-cyber-mint-700'
                      : 'border-electric-slate-200 bg-white text-electric-slate-600 hover:border-electric-slate-300'
                  }`}
                >
                  {position.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-4">
          <Label className="font-medium text-electric-slate-900">Duração da Notificação</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 5000, label: '5s' },
              { value: 10000, label: '10s' },
              { value: 15000, label: '15s' }
            ].map((duration) => (
              <label key={duration.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="duration"
                  value={duration.value}
                  checked={config.duration === duration.value}
                  onChange={(e) => onConfigChange({ duration: parseInt(e.target.value) })}
                  className="sr-only"
                />
                <div
                  className={`p-3 text-center text-sm rounded-lg border-2 transition-all ${
                    config.duration === duration.value
                      ? 'border-cyber-mint-500 bg-cyber-mint-50 text-cyber-mint-700'
                      : 'border-electric-slate-200 bg-white text-electric-slate-600 hover:border-electric-slate-300'
                  }`}
                >
                  {duration.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-4">
          <Label className="font-medium text-electric-slate-900">Tema Visual</Label>
          <div className="space-y-2">
            {[
              { value: 'default', label: 'Padrão', description: 'Verde cyber com gradiente' },
              { value: 'minimal', label: 'Minimal', description: 'Branco limpo' },
              { value: 'gaming', label: 'Gaming', description: 'Roxo/Rosa vibrante' }
            ].map((theme) => (
              <label key={theme.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={theme.value}
                  checked={config.theme === theme.value}
                  onChange={(e) => onConfigChange({ theme: e.target.value as 'default' | 'minimal' | 'gaming' })}
                  className="sr-only"
                />
                <div
                  className={`p-3 rounded-lg border-2 transition-all ${
                    config.theme === theme.value
                      ? 'border-cyber-mint-500 bg-cyber-mint-50'
                      : 'border-electric-slate-200 bg-white hover:border-electric-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-electric-slate-900">
                        {theme.label}
                      </div>
                      <div className="text-sm text-electric-slate-600">
                        {theme.description}
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full ${
                        theme.value === 'default'
                          ? 'bg-cyber-mint-500'
                          : theme.value === 'minimal'
                          ? 'bg-gray-300 border border-gray-400'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                    />
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}