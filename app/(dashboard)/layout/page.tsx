'use client'

import { FloatingNavbar } from '@/components/layout/FloatingNavbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, QrCode, ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function LayoutPage() {
  const router = useRouter()

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
              🎨 Customização de Layout
            </h1>
            <p className="text-electric-slate-600">
              Personalize os alertas de doação e QR Code da sua stream
            </p>
          </div>
        </motion.div>

        {/* Alert Customization Card */}
        <motion.div className="card-medium" variants={itemVariants}>
          <Card className="h-full border-2 hover:border-cyber-mint-400 transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-cyber-mint-500 to-cyber-mint-600 rounded-xl">
                  <Bell size={32} weight="duotone" className="text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Customizar Alerta de Doação</CardTitle>
                  <CardDescription className="mt-2">
                    Configure cores, logo e mensagens dos alertas que aparecem na stream
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-electric-slate-700">Opções disponíveis:</h4>
                <ul className="text-sm text-electric-slate-600 space-y-1">
                  <li>• Cores personalizadas (fundo, texto, bordas)</li>
                  <li>• Upload de logo e posicionamento</li>
                  <li>• Mensagens e textos customizados</li>
                  <li>• Estilos de animação e duração</li>
                </ul>
              </div>
              <Button
                onClick={() => router.push('/layout/alert')}
                className="w-full cursor-pointer hover:scale-105 transition-transform"
                variant="auth"
                size="lg"
              >
                Editar Layout do Alerta
                <ArrowRight size={20} weight="duotone" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* QR Code Customization Card */}
        <motion.div className="card-medium" variants={itemVariants}>
          <Card className="h-full border-2 hover:border-warm-coral-400 transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-warm-coral-500 to-warm-coral-600 rounded-xl">
                  <QrCode size={32} weight="duotone" className="text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Customizar QR Code</CardTitle>
                  <CardDescription className="mt-2">
                    Personalize o QR Code para receber doações com sua identidade
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-electric-slate-700">Opções disponíveis:</h4>
                <ul className="text-sm text-electric-slate-600 space-y-1">
                  <li>• Cores dos pixels e fundo do QR Code</li>
                  <li>• Logo centralizada no QR Code</li>
                  <li>• Textos superior e inferior</li>
                  <li>• Molduras e estilos visuais</li>
                </ul>
              </div>
              <Button
                onClick={() => router.push('/layout/qrcode')}
                className="w-full cursor-pointer hover:scale-105 transition-transform bg-gradient-to-r from-warm-coral-600 to-warm-coral-700 text-white hover:from-warm-coral-700 hover:to-warm-coral-800"
                size="lg"
              >
                Editar Layout do QR Code
                <ArrowRight size={20} weight="duotone" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  )
}
