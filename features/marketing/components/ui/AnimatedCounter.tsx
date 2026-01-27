'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionValue, useTransform, animate, motion, useInView } from 'motion/react'

interface AnimatedCounterProps {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
  duration = 1.5,
  className = ''
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hasAnimated, setHasAnimated] = useState(false)

  const count = useMotionValue(0)
  const rounded = useTransform(count, (value) => {
    const num = Math.round(value)
    return num.toLocaleString('en-US')
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
      const controls = animate(count, target, {
        duration,
        ease: [0.16, 1, 0.3, 1] // ease-out-expo
      })
      return controls.stop
    }
  }, [isInView, hasAnimated, count, target, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {rounded}
      </motion.span>
      {suffix}
    </span>
  )
}
