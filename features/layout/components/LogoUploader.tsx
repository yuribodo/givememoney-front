'use client'

import { useState, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from '@phosphor-icons/react'

interface LogoUploaderProps {
  label: string
  value: string | null
  onChange: (logoUrl: string | null) => void
  maxSizeMB?: number
}

export function LogoUploader({ label, value, onChange, maxSizeMB = 2 }: LogoUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      setError('Formato inválido. Use PNG, JPG ou SVG')
      return
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo ${maxSizeMB}MB`)
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      onChange(reader.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-electric-slate-700">{label}</Label>

      {value ? (
        <div className="relative w-full h-32 bg-electric-slate-50 rounded-lg border-2 border-electric-slate-300 flex items-center justify-center">
          <img
            src={value}
            alt="Logo preview"
            className="max-w-full max-h-full object-contain p-2"
          />
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 cursor-pointer hover:scale-110 transition-transform"
          >
            <X size={16} weight="duotone" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 bg-electric-slate-50 rounded-lg border-2 border-dashed border-electric-slate-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-cyber-mint-500 hover:bg-electric-slate-100 transition-all"
        >
          <ImageIcon size={32} weight="duotone" className="text-electric-slate-400" />
          <p className="text-sm text-electric-slate-600">Clique para enviar logo</p>
          <p className="text-xs text-electric-slate-500">PNG, JPG ou SVG (máx. {maxSizeMB}MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-error-rose">{error}</p>
      )}
    </div>
  )
}
