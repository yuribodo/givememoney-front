'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAlertSettings, useSaveAlertSettings } from '@/features/layout/hooks/useAlertSettings'
import { AlertConfig } from '@/features/layout/types'
import { UnifiedPreview } from '@/features/overlay/components/UnifiedPreview'
import { OverlaySettingsPanel } from '@/features/overlay/components/OverlaySettingsPanel'

const defaultConfig: AlertConfig = {
  backgroundColor: '#121621',
  textColor: '#F2F4F8',
  messageColor: '#A9B1BF',
  accentColor: '#3B82F6',
  headerText: 'Nova Doacao!',
  showDonorName: true,
  showAmount: true,
  showMessage: true,
  minDuration: 3000,
  maxDuration: 8000,
  soundEnabled: true,
  position: 'top',
}

export default function OverlayPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { data: savedConfig } = useAlertSettings()
  const saveAlertSettings = useSaveAlertSettings()
  const [config, setConfig] = useState<AlertConfig>(defaultConfig)

  useEffect(() => {
    if (savedConfig) {
      setConfig({ ...defaultConfig, ...savedConfig })
    }
  }, [savedConfig])

  const handleChange = (partial: Partial<AlertConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }))
  }

  const handleSave = () => {
    saveAlertSettings.mutate(config)
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9090'
  const overlayUrl = user ? `${backendUrl}/api/alerts/${user.id}` : ''

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-sm text-electric-slate-400">Carregando...</div>
      </div>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-6"
    >
      {/* Minimal header */}
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-electric-slate-900 tracking-tight">
          Overlay
        </h1>
        <p className="text-[13px] text-electric-slate-400 mt-0.5">
          Configure como as doacoes aparecem na sua stream
        </p>
      </div>

      {/* Layout — preview dominates */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Settings — compact left column */}
        <div className="w-full lg:w-[380px] lg:flex-shrink-0 order-2 lg:order-1">
          <div className="border border-electric-slate-100 rounded-xl bg-white p-4">
            <OverlaySettingsPanel
              config={config}
              onChange={handleChange}
              onSave={handleSave}
              isSaving={saveAlertSettings.isPending}
              overlayUrl={overlayUrl}
            />
          </div>
        </div>

        {/* Preview — takes remaining space */}
        <div className="flex-1 min-w-0 order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start">
          <UnifiedPreview config={config} />
        </div>
      </div>
    </motion.main>
  )
}
