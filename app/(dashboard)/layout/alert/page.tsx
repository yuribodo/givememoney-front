'use client'

import { useState } from 'react'
import { FloatingNavbar } from '@/components/layout/FloatingNavbar'
import { AlertPreview } from '@/features/layout/components/AlertPreview'
import { AlertCustomizer } from '@/features/layout/components/AlertCustomizer'
import { AlertConfig } from '@/features/layout/types'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'

export default function AlertEditorPage() {
  const [config, setConfig] = useState<AlertConfig>({
    // Colors
    backgroundColor: '#1f2235',
    textColor: '#ffffff',
    messageColor: '#cbd2dd',
    accentColor: '#00a896',

    // Content
    headerText: '💰 Nova Doação!',
    showDonorName: true,
    showAmount: true,
    showMessage: true,

    // Animation
    minDuration: 3000,
    maxDuration: 8000,
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
    <div className="min-h-screen bg-background with-floating-navbar">
      <FloatingNavbar isLive={false} />

      <motion.main
        className="container max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Editor de Alertas</h1>
          </div>
          <p className="text-muted-foreground">
            Personalize como os alertas de doação aparecerão durante suas lives
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Customizer Section - Left Side */}
          <motion.div variants={itemVariants}>
            <AlertCustomizer config={config} onChange={handleConfigChange} />
          </motion.div>

          {/* Preview Section - Right Side (Sticky) */}
          <motion.div variants={itemVariants} className="lg:sticky lg:top-24">
            <Card>
              <CardContent className="p-6">
                <AlertPreview config={config} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}
