'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  presets?: string[]
}

export function ColorPicker({ label, value, onChange, presets }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false)

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
      <Label className="text-sm font-medium text-electric-slate-700">{label}</Label>
      <div className="flex items-center gap-3">
        {/* Color Preview */}
        <div
          className="w-12 h-12 rounded-lg border-2 border-electric-slate-300 cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        />

        {/* Hex Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-electric-slate-300 bg-white text-electric-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyber-mint-500"
          placeholder="#000000"
        />

        {/* Native Color Picker */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer"
        />
      </div>

      {/* Color Presets */}
      {showPicker && (
        <div className="flex flex-wrap gap-2 p-3 bg-electric-slate-50 rounded-lg">
          {defaultPresets.map((preset) => (
            <Button
              key={preset}
              onClick={() => {
                onChange(preset)
                setShowPicker(false)
              }}
              className="w-10 h-10 p-0 rounded-lg border-2 border-electric-slate-200 hover:scale-110 hover:border-cyber-mint-500 transition-all cursor-pointer"
              style={{ backgroundColor: preset }}
              variant="outline"
            />
          ))}
        </div>
      )}
    </div>
  )
}
