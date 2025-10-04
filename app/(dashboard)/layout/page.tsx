'use client'

import { FloatingNavbar } from '@/components/layout/FloatingNavbar'
import { LayoutCard } from '@/components/layout/LayoutCard'
import { Bell, QrCode } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export default function LayoutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <motion.main
          className="flex flex-wrap gap-6 lg:gap-8 justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Alert Customization Card */}
          <motion.div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)]" variants={itemVariants}>
            <LayoutCard
              title="Alerta de Doação"
              description="Personalize alertas na stream"
              icon={Bell}
              backgroundColor="cyber-mint-500"
              hoverBorderColor="cyber-mint-400"
              gradientFrom="cyber-mint-500"
              gradientTo="cyber-mint-700"
              buttonGradientFrom="cyber-mint-600"
              buttonGradientTo="cyber-mint-700"
              buttonHoverFrom="cyber-mint-700"
              buttonHoverTo="cyber-mint-800"
              shadowColor="cyber-mint-500"
              glowFrom="cyber-mint-500"
              glowTo="cyber-mint-600"
              route="/layout/alert"
              buttonText="Editar Alerta"
            />
          </motion.div>

          {/* QR Code Customization Card */}
          <motion.div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)]" variants={itemVariants}>
            <LayoutCard
              title="QR Code"
              description="Personalize com sua identidade"
              icon={QrCode}
              backgroundColor="warm-coral-500"
              hoverBorderColor="warm-coral-400"
              gradientFrom="warm-coral-500"
              gradientTo="warm-coral-700"
              buttonGradientFrom="warm-coral-600"
              buttonGradientTo="warm-coral-700"
              buttonHoverFrom="warm-coral-700"
              buttonHoverTo="warm-coral-800"
              shadowColor="warm-coral-500"
              glowFrom="warm-coral-500"
              glowTo="warm-coral-600"
              route="/layout/qrcode"
              buttonText="Editar QR Code"
            />
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}
