/**
 * Animation Presets and Variants for Premium Landing Page
 * 
 * This module provides reusable Framer Motion animation configurations
 * that ensure consistent, cinematic animations throughout the application.
 * 
 * **Validates: Requirements 9.4, 10.6**
 */

import { Variants } from "framer-motion";

// ============================================================================
// DURATION CONSTANTS
// ============================================================================

/**
 * Standard animation duration values (in seconds)
 */
export const duration = {
  /** Fast animations for micro-interactions (200ms) */
  fast: 0.2,
  /** Normal animations for standard transitions (300ms) */
  normal: 0.3,
  /** Slow animations for prominent elements (500ms) */
  slow: 0.5,
  /** Very slow animations for hero/dramatic reveals (800ms) */
  verySlow: 0.8,
} as const;

// ============================================================================
// EASING CONSTANTS
// ============================================================================

/**
 * Easing curves for different animation types
 */
export const easing = {
  /** Smooth ease-out curve for natural deceleration [0.4, 0, 0.2, 1] */
  smooth: [0.4, 0, 0.2, 1] as const,
  /** Spring easing for bouncy, playful animations */
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  /** Bounce spring for more pronounced elastic effects */
  bounce: { type: "spring" as const, stiffness: 400, damping: 10 },
} as const;

// ============================================================================
// SPRING ANIMATION CONFIGURATIONS
// ============================================================================

/**
 * Predefined spring animation configurations for common use cases
 */
export const springConfig = {
  /** Gentle spring for smooth, natural motion */
  gentle: {
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
  },
  /** Default spring configuration - balanced stiffness and damping */
  default: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  /** Snappy spring for quick, responsive interactions */
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
  },
  /** Bouncy spring for playful, elastic effects */
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 10,
  },
  /** Slow spring for dramatic, weighty animations */
  slow: {
    type: "spring" as const,
    stiffness: 200,
    damping: 30,
  },
} as const;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Fade up animation - element fades in while sliding up
 * Perfect for hero sections, cards, and content reveals
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={fadeUp} initial="initial" animate="animate">
 *   Content
 * </motion.div>
 * ```
 */
export const fadeUp: Variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Simple fade in animation - element fades in without movement
 * Perfect for overlays, backgrounds, and subtle reveals
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={fadeIn} initial="initial" animate="animate">
 *   Content
 * </motion.div>
 * ```
 */
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: duration.slow,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.normal,
    },
  },
};

/**
 * Scale in animation - element fades in while scaling up
 * Perfect for modals, cards, and emphasized content
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={scaleIn} initial="initial" animate="animate">
 *   Content
 * </motion.div>
 * ```
 */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Stagger container - staggers animation of child elements
 * Use this on parent containers to create sequential reveals
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={staggerContainer} initial="initial" animate="animate">
 *   <motion.div variants={fadeUp}>Child 1</motion.div>
 *   <motion.div variants={fadeUp}>Child 2</motion.div>
 *   <motion.div variants={fadeUp}>Child 3</motion.div>
 * </motion.div>
 * ```
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger container with faster stagger timing
 * Use for grids and lists with many items
 */
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger container with slower stagger timing
 * Use for dramatic reveals with fewer items
 */
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

// ============================================================================
// ADDITIONAL ANIMATION VARIANTS
// ============================================================================

/**
 * Slide in from left animation
 * Perfect for sidebars, modals, and horizontal reveals
 */
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -40,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Slide in from right animation
 * Perfect for sidebars, modals, and horizontal reveals
 */
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 40,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Fade down animation - element fades in while sliding down
 * Perfect for dropdowns, tooltips, and top-to-bottom reveals
 */
export const fadeDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: duration.fast,
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a custom stagger container with configurable timing
 * 
 * @param staggerDelay - Delay between each child animation (in seconds)
 * @param delayChildren - Initial delay before first child animates (in seconds)
 * @returns Variants object for stagger container
 * 
 * @example
 * ```tsx
 * const customStagger = createStaggerContainer(0.08, 0.15);
 * <motion.div variants={customStagger} initial="initial" animate="animate">
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={fadeUp}>{item.content}</motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export function createStaggerContainer(
  staggerDelay: number = 0.1,
  delayChildren: number = 0.2
): Variants {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren,
      },
    },
  };
}

/**
 * Creates a custom fade up animation with configurable distance and duration
 * 
 * @param distance - Distance to move in pixels
 * @param animationDuration - Duration of the animation in seconds
 * @returns Variants object for fade up animation
 * 
 * @example
 * ```tsx
 * const heroFadeUp = createFadeUp(60, 0.8);
 * <motion.h1 variants={heroFadeUp} initial="initial" animate="animate">
 *   Hero Title
 * </motion.h1>
 * ```
 */
export function createFadeUp(
  distance: number = 40,
  animationDuration: number = duration.slow
): Variants {
  return {
    initial: {
      opacity: 0,
      y: distance,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationDuration,
        ease: easing.smooth,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: duration.fast,
      },
    },
  };
}

/**
 * Hover lift animation configuration
 * Apply directly to motion components for hover effects
 * 
 * @example
 * ```tsx
 * <motion.div whileHover={hoverLift} whileTap={tapScale}>
 *   Hover me
 * </motion.div>
 * ```
 */
export const hoverLift = {
  y: -8,
  scale: 1.02,
  transition: springConfig.snappy,
};

/**
 * Tap scale animation configuration
 * Apply to buttons and interactive elements
 * 
 * @example
 * ```tsx
 * <motion.button whileTap={tapScale}>
 *   Click me
 * </motion.button>
 * ```
 */
export const tapScale = {
  scale: 0.95,
  transition: springConfig.snappy,
};

/**
 * Hover glow animation configuration
 * Apply to cards and glass elements
 * 
 * @example
 * ```tsx
 * <motion.div whileHover={hoverGlow}>
 *   Glass card
 * </motion.div>
 * ```
 */
export const hoverGlow = {
  boxShadow: "0 0 30px rgba(37, 99, 235, 0.3)",
  transition: springConfig.default,
};

// ============================================================================
// PERFORMANCE OPTIMIZATION UTILITIES
// ============================================================================

/**
 * Performance optimization: Apply will-change CSS property for animations
 * 
 * Use sparingly! will-change should only be applied to elements that are
 * actively animating. Overuse can harm performance.
 * 
 * @example
 * ```tsx
 * <motion.div
 *   onAnimationStart={() => applyWillChange(ref.current)}
 *   onAnimationComplete={() => removeWillChange(ref.current)}
 * >
 *   Animated content
 * </motion.div>
 * ```
 */
export function applyWillChange(element: HTMLElement | null, properties: string[] = ['transform', 'opacity']): void {
  if (element) {
    element.style.willChange = properties.join(', ');
  }
}

/**
 * Performance optimization: Remove will-change CSS property after animation
 * 
 * Always remove will-change after animations complete to avoid memory issues
 */
export function removeWillChange(element: HTMLElement | null): void {
  if (element) {
    element.style.willChange = 'auto';
  }
}

/**
 * Check if user prefers reduced motion
 * Use this to conditionally disable animations for accessibility
 * 
 * @returns true if user prefers reduced motion
 * 
 * @example
 * ```tsx
 * const shouldAnimate = !prefersReducedMotion();
 * 
 * <motion.div
 *   initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
 *   animate={{ opacity: 1 }}
 * >
 *   Content
 * </motion.div>
 * ```
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Create a Framer Motion transition that respects reduced motion preference
 * 
 * When reduced motion is preferred, returns an instant transition (duration: 0.01)
 * Otherwise returns the provided transition config
 * 
 * @param transition - The default transition configuration
 * @returns Transition config that respects accessibility preferences
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={accessibleTransition({ duration: 0.5 })}
 * >
 *   Content
 * </motion.div>
 * ```
 */
export function accessibleTransition<T extends Record<string, unknown>>(
  transition: T
): T | { duration: number } {
  if (prefersReducedMotion()) {
    return { duration: 0.01 };
  }
  return transition;
}

/**
 * Create accessible animation variants that respect reduced motion preference
 * 
 * @param variants - Standard animation variants
 * @returns Variants that respect accessibility preferences
 * 
 * @example
 * ```tsx
 * const variants = accessibleVariants({
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 }
 * });
 * 
 * <motion.div variants={variants} initial="initial" animate="animate">
 *   Content
 * </motion.div>
 * ```
 */
export function accessibleVariants(variants: Variants): Variants {
  if (!prefersReducedMotion()) {
    return variants;
  }

  // When reduced motion is preferred, remove all transforms and fast transitions
  const accessibleVariants: Variants = {};
  for (const key in variants) {
    const variant = variants[key];
    if (typeof variant === "object" && variant !== null) {
      accessibleVariants[key] = {
        ...variant,
        y: 0,
        x: 0,
        scale: 1,
        rotate: 0,
        transition: { duration: 0.01 },
      };
    } else {
      accessibleVariants[key] = variant;
    }
  }
  return accessibleVariants;
}

/**
 * Performance-optimized scroll progress tracking
 * Throttles scroll events to improve performance
 * 
 * @param callback - Function to call on scroll
 * @param delay - Throttle delay in milliseconds (default: 16ms for ~60fps)
 * 
 * @example
 * ```tsx
 * useEffect(() => {
 *   const cleanup = throttledScrollHandler(() => {
 *     console.log('Scroll position:', window.scrollY);
 *   });
 *   return cleanup;
 * }, []);
 * ```
 */
export function throttledScrollHandler(callback: () => void, delay: number = 16): () => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastRan = 0;

  const handler = () => {
    const now = Date.now();
    
    if (now - lastRan >= delay) {
      callback();
      lastRan = now;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback();
        lastRan = Date.now();
      }, delay - (now - lastRan));
    }
  };

  window.addEventListener("scroll", handler, { passive: true });

  return () => {
    window.removeEventListener("scroll", handler);
    if (timeoutId) clearTimeout(timeoutId);
  };
}
