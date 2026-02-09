'use client'

import { QRCodeConfig } from '../types'
import { ColorPicker } from './ColorPicker'
import { LogoUploader } from './LogoUploader'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DownloadSimple, FloppyDisk } from '@phosphor-icons/react'

interface QRCodeCustomizerProps {
  config: QRCodeConfig
  onChange: (config: Partial<QRCodeConfig>) => void
  onSave?: () => void
  isSaving?: boolean
  onDownload?: () => void
}

export function QRCodeCustomizer({ config, onChange, onSave, isSaving, onDownload }: QRCodeCustomizerProps) {
  return (
    <div className="space-y-5">
      <Tabs defaultValue="cores">
        <TabsList variant="line" className="w-full justify-start gap-0 border-b border-electric-slate-100 pb-0">
          <TabsTrigger value="cores" className="text-[13px] px-3 pb-2.5">Cores</TabsTrigger>
          <TabsTrigger value="estilo" className="text-[13px] px-3 pb-2.5">Estilo</TabsTrigger>
          <TabsTrigger value="texto" className="text-[13px] px-3 pb-2.5">Texto</TabsTrigger>
          <TabsTrigger value="logo" className="text-[13px] px-3 pb-2.5">Logo</TabsTrigger>
        </TabsList>

        {/* ─── CORES TAB ─── */}
        <TabsContent value="cores" className="pt-5 space-y-3">
          <ColorPicker
            label="Pixels"
            value={config.pixelColor}
            onChange={(c) => onChange({ pixelColor: c })}
          />
          <ColorPicker
            label="Fundo"
            value={config.backgroundColor}
            onChange={(c) => onChange({ backgroundColor: c })}
          />
          <ColorPicker
            label="Borda"
            value={config.borderColor}
            onChange={(c) => onChange({ borderColor: c })}
          />
        </TabsContent>

        {/* ─── ESTILO TAB ─── */}
        <TabsContent value="estilo" className="pt-5 space-y-5">
          {/* Frame style */}
          <div>
            <p className="text-[11px] font-medium text-electric-slate-400 mb-2.5">Moldura</p>
            <div className="grid grid-cols-4 gap-1.5">
              {([
                { value: 'none' as const, label: 'Nenhuma' },
                { value: 'rounded' as const, label: 'Redonda' },
                { value: 'square' as const, label: 'Quadrada' },
                { value: 'neon' as const, label: 'Neon' },
              ]).map((frame) => (
                <button
                  key={frame.value}
                  type="button"
                  onClick={() => onChange({ frameStyle: frame.value })}
                  className={`py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    config.frameStyle === frame.value
                      ? 'bg-electric-slate-900 text-white'
                      : 'bg-electric-slate-50 text-electric-slate-600 hover:bg-electric-slate-100'
                  }`}
                >
                  {frame.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pixel pattern */}
          <div>
            <p className="text-[11px] font-medium text-electric-slate-400 mb-2.5">Padrao dos pixels</p>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { value: 'square' as const, label: 'Quadrado' },
                { value: 'rounded' as const, label: 'Arredondado' },
                { value: 'dots' as const, label: 'Pontos' },
              ]).map((pattern) => (
                <button
                  key={pattern.value}
                  type="button"
                  onClick={() => onChange({ pixelPattern: pattern.value })}
                  className={`py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    config.pixelPattern === pattern.value
                      ? 'bg-electric-slate-900 text-white'
                      : 'bg-electric-slate-50 text-electric-slate-600 hover:bg-electric-slate-100'
                  }`}
                >
                  {pattern.label}
                </button>
              ))}
            </div>
          </div>

          {/* QR Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium text-electric-slate-400">Tamanho</p>
              <span className="text-[11px] font-mono text-electric-slate-500 tabular-nums bg-electric-slate-50 px-1.5 py-0.5 rounded">
                {config.qrSize}px
              </span>
            </div>
            <Slider
              min={200} max={500} step={50}
              value={[config.qrSize]}
              onValueChange={(v) => onChange({ qrSize: v[0] })}
              className="cursor-pointer"
            />
          </div>
        </TabsContent>

        {/* ─── TEXTO TAB ─── */}
        <TabsContent value="texto" className="pt-5 space-y-4">
          <div>
            <p className="text-[11px] font-medium text-electric-slate-400 mb-1.5">Texto superior</p>
            <Input
              value={config.topText}
              onChange={(e) => onChange({ topText: e.target.value })}
              placeholder="Doe Agora!"
              className="text-sm h-9"
            />
          </div>

          <div>
            <p className="text-[11px] font-medium text-electric-slate-400 mb-1.5">Texto inferior</p>
            <Input
              value={config.bottomText}
              onChange={(e) => onChange({ bottomText: e.target.value })}
              placeholder="@seucanal"
              className="text-sm h-9"
            />
          </div>

          <ColorPicker
            label="Cor do texto"
            value={config.textColor}
            onChange={(c) => onChange({ textColor: c })}
          />

          {/* Text size */}
          <div>
            <p className="text-[11px] font-medium text-electric-slate-400 mb-2.5">Tamanho da fonte</p>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { value: 'small' as const, label: 'Pequeno' },
                { value: 'medium' as const, label: 'Medio' },
                { value: 'large' as const, label: 'Grande' },
              ]).map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => onChange({ textSize: size.value })}
                  className={`py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    config.textSize === size.value
                      ? 'bg-electric-slate-900 text-white'
                      : 'bg-electric-slate-50 text-electric-slate-600 hover:bg-electric-slate-100'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ─── LOGO TAB ─── */}
        <TabsContent value="logo" className="pt-5 space-y-4">
          <LogoUploader
            label="Imagem central"
            value={config.logoUrl}
            onChange={(url) => onChange({ logoUrl: url })}
          />

          {config.logoUrl && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-medium text-electric-slate-400">Tamanho</p>
                  <span className="text-[11px] font-mono text-electric-slate-500 tabular-nums bg-electric-slate-50 px-1.5 py-0.5 rounded">
                    {config.logoSize}%
                  </span>
                </div>
                <Slider
                  min={10} max={30} step={5}
                  value={[config.logoSize]}
                  onValueChange={(v) => onChange({ logoSize: v[0] })}
                  className="cursor-pointer"
                />
                <p className="text-[10px] text-electric-slate-400 mt-1.5">
                  15-25% ideal para leitura do QR
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-electric-slate-400 mb-2.5">Formato</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {([
                    { value: 'circle' as const, label: 'Circulo' },
                    { value: 'square' as const, label: 'Quadrado' },
                  ]).map((shape) => (
                    <button
                      key={shape.value}
                      type="button"
                      onClick={() => onChange({ logoShape: shape.value })}
                      className={`py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                        config.logoShape === shape.value
                          ? 'bg-electric-slate-900 text-white'
                          : 'bg-electric-slate-50 text-electric-slate-600 hover:bg-electric-slate-100'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          className="flex-1 cursor-pointer font-semibold"
          size="lg"
          onClick={onSave}
          disabled={isSaving}
        >
          <FloppyDisk size={16} weight="bold" className="mr-1.5" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onDownload}
          className="cursor-pointer"
        >
          <DownloadSimple size={16} weight="bold" />
        </Button>
      </div>
    </div>
  )
}
