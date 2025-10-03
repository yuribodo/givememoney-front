'use client'

import { useState } from 'react'
import { FloatingNavbar } from '@/components/layout/FloatingNavbar'
import { QRCodePreview } from '@/features/layout/components/QRCodePreview'
import { QRCodeCustomizer } from '@/features/layout/components/QRCodeCustomizer'
import { QRCodeConfig } from '@/features/layout/types'
import { motion } from 'framer-motion'

export default function QRCodeEditorPage() {
  const [config, setConfig] = useState<QRCodeConfig>({
    // Colors
    pixelColor: '#000000',
    backgroundColor: '#ffffff',
    borderColor: '#00a896',

    // Logo
    logoUrl: null,
    logoSize: 20,
    logoShape: 'circle',

    // Text
    topText: 'Doe Agora!',
    bottomText: '@seucanal',
    textColor: '#1f2235',
    textSize: 'medium',

    // Style
    frameStyle: 'rounded',
    qrSize: 300,
    pixelPattern: 'square',
  })

  const handleConfigChange = (newConfig: Partial<QRCodeConfig>) => {
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
              📱 Customizar QR Code
            </h1>
            <p className="text-electric-slate-600">
              Personalize o QR Code para receber doações com sua identidade visual
            </p>
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div className="card-medium" variants={itemVariants}>
          <div className="bg-white rounded-xl p-6 border-2 border-electric-slate-200">
            <h2 className="text-lg font-bold text-electric-slate-900 mb-4">
              Preview do QR Code
            </h2>
            <QRCodePreview config={config} />
          </div>
        </motion.div>

        {/* Customizer Section */}
        <motion.div className="card-medium" variants={itemVariants}>
          <QRCodeCustomizer config={config} onChange={handleConfigChange} />
        </motion.div>
      </motion.main>
    </div>
  )
}
