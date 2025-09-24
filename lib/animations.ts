import { Variants } from "motion/react"

// Shared animation variants to prevent re-creation on every render
export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 80
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  }
}

export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number]
    }
  }
}

export const ctaVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  }
}

export const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number]
    }
  }
}

// Scroll-following animation variants for sections
export const stickyScrollVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 100
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  },
  exit: {
    opacity: 0,
    y: -100,
    transition: {
      duration: 0.8,
      ease: [0.55, 0.055, 0.675, 0.19] as [number, number, number, number]
    }
  }
}

export const sectionContainerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
}

// Common viewport settings
export const viewportSettings = {
  once: true,
  margin: "0px"
}

// Immediate viewport settings for better visibility
export const immediateViewportSettings = {
  once: true,
  margin: "200px"
}

// Enhanced viewport settings for scroll-following sections
export const stickyViewportSettings = {
  once: false,
  margin: "-50px"
}

// QuickSetupSection - Speed/Velocity themed animations
export const speedSlideVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number] // elastic
    }
  }
}

export const timerCountVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateX: -90,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  }
}

export const pulseGlowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.1,
      ease: "easeOut"
    }
  }
}

// PlatformSection - Expansion/Connection themed animations
export const expandFromCenterVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    rotateY: -45
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  }
}

export const flowGradientVariants: Variants = {
  hidden: {
    opacity: 0,
    backgroundPosition: "-200% center"
  },
  visible: {
    opacity: 1,
    backgroundPosition: "200% center",
    transition: {
      duration: 1.5,
      delay: 0.4,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
}

export const cascadeVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.6,
      ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number]
    }
  }
}

export const platformsContainerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.8
    }
  }
}

export const platformItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number]
    }
  }
}