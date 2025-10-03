'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertConfig } from '../types'

interface AlertPreviewProps {
  config: AlertConfig
}

export function AlertPreview({ config }: AlertPreviewProps) {
  return (
    <div className="w-full h-64 bg-electric-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
      {/* Simulated stream background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-cyber-mint-500 to-electric-slate-800" />
      </div>

      {/* Alert Animation */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 max-w-md w-full mx-4"
          style={{
            backgroundColor: config.backgroundColor,
            borderColor: config.accentColor,
          }}
          className={`
            rounded-xl p-6
            ${config.style === 'minimal' ? 'border' : 'border-2'}
            ${config.style === 'gaming' ? 'shadow-2xl shadow-cyber-mint-500/50' : ''}
            ${config.style === 'neon' ? 'shadow-[0_0_30px_rgba(0,171,150,0.6)]' : ''}
            ${config.style === 'glassmorphism' ? 'glass backdrop-blur-xl' : ''}
          `}
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

          {/* Logo and Content */}
          <div className="flex items-center gap-4">
            {config.logoUrl && config.logoPosition !== 'none' && (
              <div
                className={`
                  flex-shrink-0 rounded-lg overflow-hidden
                  ${config.logoSize === 'small' ? 'w-12 h-12' : ''}
                  ${config.logoSize === 'medium' ? 'w-16 h-16' : ''}
                  ${config.logoSize === 'large' ? 'w-20 h-20' : ''}
                  ${config.logoPosition === 'right' ? 'order-2' : ''}
                `}
              >
                <img
                  src={config.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className={`flex-1 ${config.logoPosition === 'center' ? 'text-center' : ''}`}>
              {config.showDonorName && (
                <p className="font-bold text-xl" style={{ color: config.textColor }}>
                  João Silva
                </p>
              )}
              {config.showAmount && (
                <p className="font-bold text-2xl mt-1 money-display" style={{ color: config.textColor }}>
                  R$ 50,00
                </p>
              )}
              {config.showMessage && (
                <p className="mt-2 text-sm" style={{ color: config.messageColor }}>
                  "Parabéns pela live! Continue assim 🚀"
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Duration Indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-electric-slate-800/80 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: config.duration / 1000, ease: 'linear' }}
            className="h-full bg-cyber-mint-500"
          />
        </div>
      </div>
    </div>
  )
}
