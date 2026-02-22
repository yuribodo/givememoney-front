'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from '@phosphor-icons/react'
import { AlertConfig } from '@/features/layout/types'

interface UnifiedPreviewProps {
  config: AlertConfig
}

export function UnifiedPreview({ config }: UnifiedPreviewProps) {
  const [key, setKey] = useState(0)
  const [visible, setVisible] = useState(true)
  const [autoReplay, setAutoReplay] = useState(true)
  const avgDuration = (config.minDuration + config.maxDuration) / 2

  const replay = useCallback(() => {
    setVisible(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setKey((k) => k + 1)
        setVisible(true)
      })
    })
  }, [])

  // Auto-replay when config changes
  useEffect(() => {
    if (autoReplay) replay()
  }, [
    config.backgroundColor,
    config.textColor,
    config.messageColor,
    config.accentColor,
    config.position,
    config.showDonorName,
    config.showAmount,
    config.showMessage,
    config.headerText,
    autoReplay,
    replay,
  ])

  const positionStyles: Record<string, string> = {
    top: 'justify-start pt-10',
    center: 'justify-center',
    bottom: 'justify-end pb-10',
  }

  return (
    <div>
      {/* Preview frame - aligned with dashboard theme */}
      <div className="relative rounded-xl overflow-hidden bg-white border border-electric-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        {/* Top bar - subtle browser chrome */}
        <div className="flex items-center justify-between px-3 h-8 bg-electric-slate-50 border-b border-electric-slate-100">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[10px] text-electric-slate-500 font-mono">Browser Source - 1920 x 1080</span>
          <button
            onClick={replay}
            className="flex items-center gap-1 text-[10px] text-electric-slate-500 hover:text-electric-slate-900 transition-colors cursor-pointer"
          >
            <Play size={9} weight="fill" />
            replay
          </button>
        </div>

        {/* Viewport 16:9 */}
        <div
          className={`relative aspect-video flex flex-col items-center overflow-hidden ${positionStyles[config.position] || positionStyles.top} bg-gradient-to-br from-[#f8fbf8] via-[#f1f6f5] to-[#eaf3f1]`}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(31,34,53,0.12) 0.6px, transparent 0.6px)',
              backgroundSize: '22px 22px',
            }}
          />
          {/* Alert */}
          <AnimatePresence mode="wait">
            {visible && (
              <motion.div
                key={key}
                initial={{
                  opacity: 0,
                  y: config.position === 'bottom' ? 16 : -16,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative z-10 w-[420px] max-w-[calc(100vw-32px)]"
              >
                {/* Card */}
                <div
                  className="relative rounded-[14px] overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                  style={{ backgroundColor: config.backgroundColor }}
                >
                  <div className="px-5 py-4">
                    {/* Header */}
                    {config.headerText && (
                      <div
                        className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5 opacity-70"
                        style={{ color: config.accentColor }}
                      >
                        {config.headerText}
                      </div>
                    )}

                    {/* Main content */}
                    <div className="flex items-baseline justify-between gap-2.5">
                      {config.showDonorName && (
                        <p
                          className="text-[16px] font-semibold truncate min-w-0 flex-1"
                          style={{ color: config.textColor }}
                        >
                          CryptoFan42
                        </p>
                      )}
                      {config.showAmount && (
                        <p
                          className="text-[20px] font-bold flex-shrink-0 tabular-nums"
                          style={{ color: config.accentColor }}
                        >
                          0.5 SOL
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    {config.showMessage && (
                      <p
                        className="mt-1.5 text-[13px] leading-[1.45] overflow-hidden"
                        style={{
                          color: config.messageColor,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        Boa live! Continue assim
                      </p>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="h-0.5 bg-white/10">
                    <motion.div
                      key={`p-${key}`}
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ duration: avgDuration / 1000, ease: 'linear' }}
                      className="h-full origin-left"
                      style={{ backgroundColor: config.accentColor }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compact status row beneath the monitor */}
      <div className="flex items-center justify-between mt-2 px-0.5">
        <div className="flex items-center gap-3 text-[10px] text-electric-slate-400">
          <span className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: config.accentColor }}
            />
            ao vivo
          </span>
          <span className="text-electric-slate-300">|</span>
          <span>{config.position === 'top' ? 'topo' : config.position === 'bottom' ? 'base' : 'centro'}</span>
          <span className="text-electric-slate-300">|</span>
          <span>{avgDuration / 1000}s</span>
        </div>
        <label className="flex items-center gap-1.5 text-[10px] text-electric-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoReplay}
            onChange={(e) => setAutoReplay(e.target.checked)}
            className="w-3 h-3 rounded cursor-pointer"
            style={{ accentColor: config.accentColor }}
          />
          auto-replay
        </label>
      </div>
    </div>
  )
}
