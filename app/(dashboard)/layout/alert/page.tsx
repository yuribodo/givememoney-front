'use client'

import { useState } from 'react'
import { FloatingNavbar } from '@/components/layout/FloatingNavbar'
import { AlertPreview } from '@/features/layout/components/AlertPreview'
import { AlertCustomizer } from '@/features/layout/components/AlertCustomizer'
import { AlertConfig } from '@/features/layout/types'
import { motion } from 'framer-motion'

export default function AlertEditorPage() {
  const [config, setConfig] = useState<AlertConfig>({
    // Colors
    backgroundColor: '#1f2235',
    textColor: '#ffffff',
    messageColor: '#cbd2dd',
    accentColor: '#00a896',

    // Logo
    logoUrl: null,
    logoPosition: 'left',
    logoSize: 'medium',

    // Content
    headerText: '💰 Nova Doação!',
    showDonorName: true,
    showAmount: true,
    showMessage: true,

    // Style
    style: 'gaming',
    duration: 5000,
    soundEnabled: true,
  })

  const handleConfigChange = (newConfig: Partial<AlertConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  }

  return (
    <div className="min-h-screen bg-pearl with-floating-navbar">
      <FloatingNavbar isLive={false} />

      <motion.main
        className="dashboard-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Page Header */}
        <motion.div className="card-large" variants={itemVariants}>
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-electric-slate-900 mb-2">
              🔔 Customizar Alerta de Doação
            </h1>
            <p className="text-electric-slate-600">
              Configure as cores, logo e mensagens que aparecerão nos alertas da sua stream
            </p>
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div className="card-medium" variants={itemVariants}>
          <div className="bg-white rounded-xl p-6 border-2 border-electric-slate-200">
            <h2 className="text-lg font-bold text-electric-slate-900 mb-4">
              Preview em Tempo Real
            </h2>
            <AlertPreview config={config} />
          </div>
        </motion.div>

        {/* Customizer Section */}
        <motion.div className="card-medium" variants={itemVariants}>
          <AlertCustomizer config={config} onChange={handleConfigChange} />
        </motion.div>
      </motion.main>
    </div>
  )
}
