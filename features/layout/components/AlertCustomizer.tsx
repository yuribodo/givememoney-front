'use client'

import { AlertConfig } from '../types'
import { ColorPicker } from './ColorPicker'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

interface AlertCustomizerProps {
  config: AlertConfig
  onChange: (config: Partial<AlertConfig>) => void
  onSave?: () => void
  isSaving?: boolean
}

export function AlertCustomizer({ config, onChange, onSave, isSaving }: AlertCustomizerProps) {
  const isDurationValid = config.minDuration <= config.maxDuration

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Colors Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cores</CardTitle>
            <CardDescription>
              Personalize as cores do alerta de doação
            </CardDescription>
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

      <Separator />

      {/* Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conteúdo</CardTitle>
          <CardDescription>
            Configure quais informações serão exibidas no alerta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="headerText" className="text-sm font-medium">
              Texto de Cabeçalho
            </Label>
            <Input
              id="headerText"
              value={config.headerText}
              onChange={(e) => onChange({ headerText: e.target.value })}
              placeholder="💰 Nova Doação!"
              className="w-full"
            />
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="showDonorName" className="text-sm font-medium cursor-pointer">
                Mostrar Nome do Doador
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exibe o nome de quem fez a doação</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="showDonorName"
              checked={config.showDonorName}
              onCheckedChange={(checked) => onChange({ showDonorName: checked })}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="showAmount" className="text-sm font-medium cursor-pointer">
                Mostrar Valor
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exibe o valor da doação</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="showAmount"
              checked={config.showAmount}
              onCheckedChange={(checked) => onChange({ showAmount: checked })}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="showMessage" className="text-sm font-medium cursor-pointer">
                Mostrar Mensagem do Doador
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exibe a mensagem personalizada do doador</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="showMessage"
              checked={config.showMessage}
              onCheckedChange={(checked) => onChange({ showMessage: checked })}
              className="cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Animation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Animação</CardTitle>
          <CardDescription>
            Defina a duração e efeitos do alerta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="minDuration" className="text-sm font-medium">
                Duração Mínima
              </Label>
              <span className="text-sm font-mono text-muted-foreground">
                {config.minDuration / 1000}s
              </span>
            </div>
            <Slider
              id="minDuration"
              min={2000}
              max={10000}
              step={500}
              value={[config.minDuration]}
              onValueChange={(values) => {
                const newMin = values[0]
                onChange({
                  minDuration: newMin,
                  // Auto-adjust maxDuration if needed
                  ...(newMin > config.maxDuration && { maxDuration: newMin })
                })
              }}
              className="w-full cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxDuration" className="text-sm font-medium">
                Duração Máxima
              </Label>
              <span className="text-sm font-mono text-muted-foreground">
                {config.maxDuration / 1000}s
              </span>
            </div>
            <Slider
              id="maxDuration"
              min={2000}
              max={10000}
              step={500}
              value={[config.maxDuration]}
              onValueChange={(values) => {
                const newMax = values[0]
                onChange({
                  maxDuration: newMax,
                  // Auto-adjust minDuration if needed
                  ...(newMax < config.minDuration && { minDuration: newMax })
                })
              }}
              className="w-full cursor-pointer"
            />
          </div>

          {!isDurationValid && (
            <p className="text-sm text-destructive">
              A duração mínima deve ser menor ou igual à duração máxima
            </p>
          )}

          <Separator className="my-4" />

          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="soundEnabled" className="text-sm font-medium cursor-pointer">
                Habilitar Efeito Sonoro
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reproduz um som quando o alerta aparecer</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="soundEnabled"
              checked={config.soundEnabled}
              onCheckedChange={(checked) => onChange({ soundEnabled: checked })}
              className="cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Save Button */}
      <Button
        className="w-full cursor-pointer"
        variant="default"
        size="lg"
        disabled={!isDurationValid || isSaving}
        onClick={onSave}
      >
        {isSaving ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
      </div>
    </TooltipProvider>
  )
}
