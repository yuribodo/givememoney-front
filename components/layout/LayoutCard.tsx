'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Icon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface LayoutCardProps {
  title: string
  description: string
  icon: Icon
  backgroundColor: string
  hoverBorderColor: string
  gradientFrom: string
  gradientTo: string
  buttonGradientFrom: string
  buttonGradientTo: string
  buttonHoverFrom: string
  buttonHoverTo: string
  shadowColor: string
  glowFrom: string
  glowTo: string
  route: string
  buttonText: string
}

export function LayoutCard({
  title,
  description,
  icon: IconComponent,
  backgroundColor,
  hoverBorderColor,
  gradientFrom,
  gradientTo,
  buttonGradientFrom,
  buttonGradientTo,
  buttonHoverFrom,
  buttonHoverTo,
  shadowColor,
  glowFrom,
  glowTo,
  route,
  buttonText,
}: LayoutCardProps) {
  const router = useRouter()

  return (
    <Card className={`group relative overflow-hidden border-2 border-electric-slate-200/60 hover:border-${hoverBorderColor} transition-all duration-500 hover:shadow-2xl bg-white`}>
      {/* Background Pattern/Illustration */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-${backgroundColor}/5 via-white to-${backgroundColor}/10 transition-opacity duration-500`}>
        <IconComponent
          size={280}
          className={`absolute -right-24 -top-24 text-${backgroundColor}/8 group-hover:text-${backgroundColor}/12 transition-all duration-500`}
          weight="duotone"
        />
      </div>

      {/* Glow Effect on Hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glowFrom}/20 to-${glowTo}/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

      {/* Content */}
      <CardContent className="relative z-10 p-6 lg:p-8 flex flex-col gap-6">
        <div className="space-y-5">
          {/* Large Icon */}
          <div
            className={`w-16 h-16 rounded-3xl bg-gradient-to-br from-${gradientFrom} to-${gradientTo} flex items-center justify-center shadow-2xl shadow-${shadowColor}/20`}
          >
            <IconComponent size={32} weight="duotone" className="text-white" />
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-electric-slate-900">
              {title}
            </h2>
            <p className="text-base text-electric-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => router.push(route)}
          className={`w-full h-12 text-base font-semibold bg-gradient-to-r from-${buttonGradientFrom} to-${buttonGradientTo} hover:from-${buttonHoverFrom} hover:to-${buttonHoverTo} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer`}
          size="lg"
        >
          <span>{buttonText}</span>
          <ArrowRight
            size={20}
            weight="duotone"
          />
        </Button>
      </CardContent>
    </Card>
  )
}
