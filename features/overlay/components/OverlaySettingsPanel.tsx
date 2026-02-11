'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  CheckCircle,
  CaretDown,
  SpeakerHigh,
  SpeakerSlash,
} from '@phosphor-icons/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/features/layout/components/ColorPicker'
import { AlertConfig } from '@/features/layout/types'

interface OverlaySettingsPanelProps {
  config: AlertConfig
  onChange: (partial: Partial<AlertConfig>) => void
  onSave: () => void
  isSaving: boolean
  overlayUrl: string
}

const THEMES = {
  clean: {
    label: 'Escuro',
    colors: { backgroundColor: '#121621', textColor: '#F2F4F8', messageColor: '#A9B1BF', accentColor: '#3B82F6' },
  },
  minimal: {
    label: 'Claro',
    colors: { backgroundColor: '#ffffff', textColor: '#1A1D1A', messageColor: '#5C665C', accentColor: '#3B82F6' },
  },
  custom: {
    label: 'Custom',
    colors: null,
  },
} as const

type ThemeKey = keyof typeof THEMES

function detectTheme(config: AlertConfig): ThemeKey {
  for (const [key, theme] of Object.entries(THEMES)) {
    if (key === 'custom' || !theme.colors) continue
    const c = theme.colors
    if (
      config.backgroundColor === c.backgroundColor &&
      config.textColor === c.textColor &&
      config.messageColor === c.messageColor &&
      config.accentColor === c.accentColor
    ) return key as ThemeKey
  }
  return 'custom'
}

export function OverlaySettingsPanel({ config, onChange, onSave, isSaving, overlayUrl }: OverlaySettingsPanelProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeKey>(() => detectTheme(config))
  const [copied, setCopied] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const isDurationValid = config.minDuration <= config.maxDuration

  const handleThemeSelect = (key: ThemeKey) => {
    setActiveTheme(key)
    const theme = THEMES[key]
    if (theme.colors) onChange(theme.colors)
  }

  const handleColorChange = (partial: Partial<AlertConfig>) => {
    setActiveTheme('custom')
    onChange(partial)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(overlayUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleTestAlert = async () => {
    if (!overlayUrl || isTesting) return

    setIsTesting(true)
    setTestStatus('idle')

    try {
      const response = await fetch('/api/proxy/api/auth/alerts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to send test alert')
      }

      setTestStatus('success')
    } catch (error) {
      console.error('Test alert failed:', error)
      setTestStatus('error')
    } finally {
      setIsTesting(false)
      setTimeout(() => setTestStatus('idle'), 2500)
    }
  }

  return (
    <div className="space-y-5">
      <Tabs defaultValue="style">
        <TabsList variant="line" className="w-full justify-start gap-0 border-b border-electric-slate-100 pb-0">
          <TabsTrigger value="style" className="text-[13px] px-3 pb-2.5">Estilo</TabsTrigger>
          <TabsTrigger value="content" className="text-[13px] px-3 pb-2.5">Conteudo</TabsTrigger>
          <TabsTrigger value="timing" className="text-[13px] px-3 pb-2.5">Tempo</TabsTrigger>
          <TabsTrigger value="obs" className="text-[13px] px-3 pb-2.5">OBS</TabsTrigger>
        </TabsList>

        {/* ─── STYLE TAB ─── */}
        <TabsContent value="style" className="pt-5 space-y-5">
          {/* Theme presets — each is a mini alert preview */}
          <div>
            <p className="text-[11px] font-medium text-electric-slate-400 mb-2.5">Tema base</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(THEMES) as [ThemeKey, (typeof THEMES)[ThemeKey]][]).map(([key, theme]) => {
                const isActive = activeTheme === key
                const c = theme.colors
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleThemeSelect(key)}
                    className={`group relative rounded-lg border transition-all cursor-pointer overflow-hidden ${
                      isActive
                        ? 'border-electric-slate-900 ring-1 ring-electric-slate-900/10'
                        : 'border-electric-slate-100 hover:border-electric-slate-200'
                    }`}
                  >
                    {/* Mini preview swatch */}
                    <div
                      className="h-14 flex items-center justify-center px-2"
                      style={{ backgroundColor: c ? c.backgroundColor : '#f5f5f5' }}
                    >
                      {c ? (
                        <div className="w-full max-w-[90px]">
                          <div className="h-[2px] rounded-full mb-1.5" style={{ backgroundColor: c.accentColor }} />
                          <div className="h-[3px] w-3/4 rounded-full mb-1" style={{ backgroundColor: c.textColor, opacity: 0.7 }} />
                          <div className="h-[2px] w-1/2 rounded-full" style={{ backgroundColor: c.messageColor, opacity: 0.4 }} />
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full border border-dashed border-electric-slate-300" />
                          <div className="w-3 h-3 rounded-full border border-dashed border-electric-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className={`text-center py-1.5 text-[11px] font-medium ${
                      isActive ? 'text-electric-slate-900' : 'text-electric-slate-600'
                    }`}>
                      {theme.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color pickers — shown for custom OR expandable for presets */}
          <AnimatePresence initial={false}>
            {activeTheme === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-3 border-t border-electric-slate-100">
                  <ColorPicker label="Fundo" value={config.backgroundColor} onChange={(c) => handleColorChange({ backgroundColor: c })} />
                  <ColorPicker label="Texto" value={config.textColor} onChange={(c) => handleColorChange({ textColor: c })} />
                  <ColorPicker label="Mensagem" value={config.messageColor} onChange={(c) => handleColorChange({ messageColor: c })} />
                  <ColorPicker label="Destaque" value={config.accentColor} onChange={(c) => handleColorChange({ accentColor: c })} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Position — inline selector */}
          <div>
            <p className="text-[11px] font-medium text-electric-slate-400 mb-2.5">Posicao</p>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { value: 'top' as const, label: 'Topo' },
                { value: 'center' as const, label: 'Centro' },
                { value: 'bottom' as const, label: 'Base' },
              ]).map((pos) => (
                <button
                  key={pos.value}
                  type="button"
                  onClick={() => onChange({ position: pos.value })}
                  className={`py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    config.position === pos.value
                      ? 'bg-electric-slate-900 text-white'
                      : 'bg-electric-slate-50 text-electric-slate-600 hover:bg-electric-slate-100'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ─── CONTENT TAB ─── */}
        <TabsContent value="content" className="pt-5 space-y-4">
          <div>
            <p className="text-[11px] font-medium text-electric-slate-400 mb-1.5">Cabecalho</p>
            <Input
              value={config.headerText}
              onChange={(e) => onChange({ headerText: e.target.value })}
              placeholder="Nova Doacao!"
              className="text-sm h-9"
            />
          </div>

          <div className="space-y-0 divide-y divide-electric-slate-50">
            {[
              { id: 'showDonorName', label: 'Nome do doador', key: 'showDonorName' as const },
              { id: 'showAmount', label: 'Valor', key: 'showAmount' as const },
              { id: 'showMessage', label: 'Mensagem', key: 'showMessage' as const },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2.5">
                <label htmlFor={item.id} className="text-[13px] text-electric-slate-700 cursor-pointer">
                  {item.label}
                </label>
                <Switch
                  id={item.id}
                  checked={config[item.key]}
                  onCheckedChange={(v) => onChange({ [item.key]: v })}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ─── TIMING TAB ─── */}
        <TabsContent value="timing" className="pt-5 space-y-5">
          {/* Duration — single section with both sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-electric-slate-400">Duracao minima</p>
                <span className="text-[11px] font-mono text-electric-slate-500 tabular-nums bg-electric-slate-50 px-1.5 py-0.5 rounded">
                  {config.minDuration / 1000}s
                </span>
              </div>
              <Slider
                min={2000} max={10000} step={500}
                value={[config.minDuration]}
                onValueChange={(v) => onChange({
                  minDuration: v[0],
                  ...(v[0] > config.maxDuration && { maxDuration: v[0] }),
                })}
                className="cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-electric-slate-400">Duracao maxima</p>
                <span className="text-[11px] font-mono text-electric-slate-500 tabular-nums bg-electric-slate-50 px-1.5 py-0.5 rounded">
                  {config.maxDuration / 1000}s
                </span>
              </div>
              <Slider
                min={2000} max={10000} step={500}
                value={[config.maxDuration]}
                onValueChange={(v) => onChange({
                  maxDuration: v[0],
                  ...(v[0] < config.minDuration && { minDuration: v[0] }),
                })}
                className="cursor-pointer"
              />
            </div>

            {!isDurationValid && (
              <p className="text-xs text-error-rose">Minima deve ser menor ou igual a maxima</p>
            )}
          </div>

          {/* Sound — compact */}
          <div className="flex items-center justify-between pt-3 border-t border-electric-slate-100">
            <div className="flex items-center gap-2">
              {config.soundEnabled
                ? <SpeakerHigh size={15} weight="fill" className="text-electric-slate-600" />
                : <SpeakerSlash size={15} weight="fill" className="text-electric-slate-300" />
              }
              <span className="text-[13px] text-electric-slate-700">Som</span>
            </div>
            <Switch
              checked={config.soundEnabled}
              onCheckedChange={(v) => onChange({ soundEnabled: v })}
              className="cursor-pointer"
            />
          </div>
        </TabsContent>

        {/* ─── OBS TAB ─── */}
        <TabsContent value="obs" className="pt-5 space-y-4">
          {/* URL field */}
          <div>
            <p className="text-[11px] font-medium text-electric-slate-400 mb-1.5">URL do overlay</p>
            <div className="flex gap-1.5">
              <div className="flex-1 px-3 py-2 rounded-lg bg-electric-slate-50 border border-electric-slate-100 font-mono text-[11px] text-electric-slate-600 truncate select-all">
                {overlayUrl || '...'}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                disabled={copied || !overlayUrl}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  copied
                    ? 'bg-cyber-mint-50 text-cyber-mint-600 border border-cyber-mint-200'
                    : 'bg-electric-slate-900 text-white hover:bg-electric-slate-800'
                }`}
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} weight="fill" /> Copiado
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy size={12} weight="bold" /> Copiar
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestAlert}
                disabled={!overlayUrl || isTesting}
                className="h-8 text-[11px]"
              >
                {isTesting ? 'Enviando...' : 'Testar alerta'}
              </Button>
              {testStatus === 'success' && (
                <span className="text-[11px] text-cyber-mint-600">Enviado para o OBS</span>
              )}
              {testStatus === 'error' && (
                <span className="text-[11px] text-error-rose">Falha ao enviar</span>
              )}
            </div>
          </div>

          {/* Tutorial */}
          <button
            type="button"
            onClick={() => setShowTutorial((p) => !p)}
            className="flex items-center gap-1.5 text-[12px] text-electric-slate-500 hover:text-electric-slate-700 font-medium cursor-pointer"
          >
            <CaretDown
              size={12}
              weight="bold"
              className={`transition-transform duration-200 ${showTutorial ? 'rotate-180' : ''}`}
            />
            Como usar no OBS
          </button>

          <AnimatePresence>
            {showTutorial && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <ol className="space-y-2 text-[12px] text-electric-slate-600 list-decimal list-inside marker:text-electric-slate-300 marker:font-mono">
                  <li>Abra o OBS e selecione a cena</li>
                  <li>Fontes &rarr; <strong>+</strong> &rarr; Browser Source</li>
                  <li>Cole a URL no campo URL</li>
                  <li>Dimensoes: <span className="font-mono text-[11px]">1920 x 1080</span></li>
                  <li>Posicione sobre a stream</li>
                </ol>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 pt-3 border-t border-electric-slate-100 text-[11px]">
                  {[
                    ['Resolucao', '1920 x 1080'],
                    ['Transparencia', 'Sim'],
                    ['Atualizacao', 'Tempo real'],
                    ['Compativel', 'OBS, XSplit, Streamlabs'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-0.5">
                      <span className="text-electric-slate-400">{k}</span>
                      <span className="text-electric-slate-700 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Save */}
      <Button
        className="w-full cursor-pointer font-semibold"
        size="lg"
        disabled={!isDurationValid || isSaving}
        onClick={onSave}
      >
        {isSaving ? 'Salvando...' : 'Salvar'}
      </Button>
    </div>
  )
}
