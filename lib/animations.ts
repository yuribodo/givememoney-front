import { Variants } from "motion/react"

// ===== AWWWARDS DESIGN - Subtle Animations =====

// Ease out expo - dramatic exits, subtle entrance
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]
const easeOutQuart = [0.25, 1, 0.5, 1] as [number, number, number, number]

// Hero staggered entrance - subtle y: 20, not dramatic y: 80
export const heroElementVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay * 0.1,
      ease: easeOutExpo
    }
  })
}

// Fade in with subtle movement
export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOutExpo
    }
  }
}

// Simple fade for dividers and subtle elements
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easeOutQuart
    }
  }
}

// CTA section variants
export const ctaVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOutExpo
    }
  }
}

// Button entrance
export const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: easeOutExpo
    }
  }
}

// Container with staggered children
export const sectionContainerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.15
    }
  }
}

// Staggered item for lists
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo
    }
  }
}

// Viewport settings - trigger when visible
export const viewportSettings = {
  once: true,
  margin: "-100px"
}

// Immediate viewport - trigger early for hero
export const immediateViewportSettings = {
  once: true,
  margin: "0px"
}

// ===== Legacy variants for backward compatibility =====

export const stickyScrollVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: easeOutQuart }
  }
}

export const stickyViewportSettings = {
  once: false,
  margin: "-50px"
}

export const speedSlideVariants: Variants = fadeInUpVariants
export const timerCountVariants: Variants = fadeInUpVariants
export const pulseGlowVariants: Variants = fadeInUpVariants
export const expandFromCenterVariants: Variants = fadeInUpVariants
export const flowGradientVariants: Variants = fadeInVariants
export const cascadeVariants: Variants = fadeInUpVariants
export const platformsContainerVariants: Variants = sectionContainerVariants
export const platformItemVariants: Variants = staggerItemVariants
