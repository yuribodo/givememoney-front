'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Palette } from 'lucide-react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  presets?: string[]
}

export function ColorPicker({ label, value, onChange, presets }: ColorPickerProps) {
  const defaultPresets = presets || [
    '#00a896', // cyber-mint-500
    '#007569', // cyber-mint-700
    '#ff6b8a', // warm-coral
    '#f43f5e', // error-rose
    '#ffb800', // electric-gold
    '#4f46e5', // trust-indigo
    '#10d9a7', // success-emerald
    '#1f2235', // electric-slate-900
    '#6b7899', // electric-slate-500
    '#ffffff', // white
    '#000000', // black
  ]

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        {/* Color Preview + Hex Input */}
        <div className="flex-1 flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-md border-2 border-border flex-shrink-0"
            style={{ backgroundColor: value }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-text"
            placeholder="#000000"
          />
        </div>

        {/* Popover with Presets */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="flex-shrink-0 cursor-pointer">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-2">Cores Predefinidas</h4>
                <div className="grid grid-cols-6 gap-2">
                  {defaultPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => onChange(preset)}
                      className="w-8 h-8 rounded-md border-2 border-border hover:scale-110 hover:border-ring transition-all cursor-pointer"
                      style={{ backgroundColor: preset }}
                      title={preset}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t">
                <Label htmlFor={`color-picker-${label}`} className="text-xs text-muted-foreground mb-2 block">
                  Ou escolha uma cor personalizada
                </Label>
                <input
                  id={`color-picker-${label}`}
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-10 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
