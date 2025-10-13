'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertConfig } from '../types'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

interface AlertPreviewProps {
  config: AlertConfig
}

export function AlertPreview({ config }: AlertPreviewProps) {
  const [key, setKey] = useState(0)
  const avgDuration = (config.minDuration + config.maxDuration) / 2

  const handleReplay = () => {
    setKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-muted-foreground">Preview ao Vivo</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleReplay} className="cursor-pointer">
          <RotateCcw className="h-3 w-3 mr-1" />
          Testar
        </Button>
      </div>

      <div className="w-full h-64 bg-electric-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
        {/* Simulated stream background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-cyber-mint-500 to-electric-slate-800" />
        </div>

        {/* Alert Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 max-w-md w-full mx-4 rounded-xl p-6 border-2 shadow-2xl"
            style={{
              backgroundColor: config.backgroundColor,
              borderColor: config.accentColor,
              boxShadow: `0 0 30px ${config.accentColor}40`,
            }}
          >
            {/* Header Message */}
            {config.headerText && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-3 font-bold text-lg"
                style={{ color: config.textColor }}
              >
                {config.headerText}
              </motion.p>
            )}

            {/* Content */}
            <div className="text-center">
              {config.showDonorName && (
                <p className="font-bold text-xl" style={{ color: config.textColor }}>
                  João Silva
                </p>
              )}
              {config.showAmount && (
                <p className="font-bold text-2xl mt-1" style={{ color: config.textColor }}>
                  R$ 50,00
                </p>
              )}
              {config.showMessage && (
                <p className="mt-2 text-sm" style={{ color: config.messageColor }}>
                  "Parabéns pela live! Continue assim 🚀"
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Duration Indicator */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-electric-slate-800/80 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <motion.div
              key={`progress-${key}`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: avgDuration / 1000, ease: 'linear' }}
              className="h-full"
              style={{ backgroundColor: config.accentColor }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
