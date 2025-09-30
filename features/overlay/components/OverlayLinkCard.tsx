'use client'

import { useState } from 'react'
import { Link, Copy, CheckCircle, BookOpen, Question } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OverlayLinkCardProps {
  overlayUrl: string
}

export function OverlayLinkCard({ overlayUrl }: OverlayLinkCardProps) {
  const [copied, setCopied] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(overlayUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const tutorialSteps = [
    {
      step: 1,
      title: 'Abrir OBS Studio',
      description: 'Certifique-se que o OBS está aberto e sua cena está selecionada'
    },
    {
      step: 2,
      title: 'Adicionar Fonte Browser',
      description: 'Clique em "+" nas Fontes → Browser Source'
    },
    {
      step: 3,
      title: 'Configurar URL',
      description: 'Cole a URL do overlay no campo URL'
    },
    {
      step: 4,
      title: 'Definir Dimensões',
      description: 'Width: 1920px, Height: 1080px'
    },
    {
      step: 5,
      title: 'Posicionar',
      description: 'Mova e redimensione conforme necessário'
    }
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Link size={20} weight="duotone" className="text-cyber-mint-500" />
          LINK PARA OBS
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* URL Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-electric-slate-700">
            URL do Overlay
          </div>

          <div className="p-3 bg-electric-slate-50 rounded-lg border break-all">
            <div className="money-display text-sm text-electric-slate-700">
              {overlayUrl}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCopyLink}
              variant={copied ? "default" : "outline"}
              className="flex items-center gap-2 flex-1"
              disabled={copied}
            >
              {copied ? (
                <>
                  <CheckCircle size={16} weight="duotone" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy size={16} weight="duotone" />
                  Copiar Link
                </>
              )}
            </Button>

            <Button
              onClick={() => setShowTutorial(!showTutorial)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <BookOpen size={16} weight="duotone" />
              Tutorial OBS
            </Button>
          </div>
        </div>

        {/* Tutorial Section */}
        {showTutorial && (
          <div className="space-y-4 p-4 bg-cyber-mint-25 rounded-lg border border-cyber-mint-200">
            <div className="flex items-center gap-2 text-cyber-mint-700 font-medium">
              <Question size={16} weight="duotone" />
              Como adicionar no OBS Studio
            </div>

            <div className="space-y-3">
              {tutorialSteps.map((step) => (
                <div key={step.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyber-mint-500 text-white text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div>
                    <div className="font-medium text-electric-slate-900 text-sm">
                      {step.title}
                    </div>
                    <div className="text-sm text-electric-slate-600">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-electric-gold-50 rounded border border-electric-gold-200">
              <div className="flex items-start gap-2">
                <Question size={16} weight="duotone" className="text-electric-gold-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-electric-gold-800">
                    Dica importante:
                  </div>
                  <div className="text-electric-gold-700">
                    Certifique-se de que a fonte Browser Source está sempre no topo da lista para que as doações apareçam sobre outros elementos.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="space-y-3 pt-3 border-t border-electric-slate-200">
          <div className="text-sm font-medium text-electric-slate-700">
            Informações Técnicas
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-electric-slate-600">Resolução Recomendada:</div>
              <div className="font-medium text-electric-slate-900">1920 x 1080px</div>
            </div>
            <div>
              <div className="text-electric-slate-600">Transparência:</div>
              <div className="font-medium text-electric-slate-900">Suportada</div>
            </div>
            <div>
              <div className="text-electric-slate-600">Atualização:</div>
              <div className="font-medium text-electric-slate-900">Tempo Real</div>
            </div>
            <div>
              <div className="text-electric-slate-600">Compatibilidade:</div>
              <div className="font-medium text-electric-slate-900">OBS, XSplit</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}