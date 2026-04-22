import { motion } from 'framer-motion'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
}

/**
 * Stagger-reveals direct children as they enter the viewport.
 * Each child should be wrapped in <StaggerItem>.
 *
 * @param {{ className?: string, children: React.ReactNode, amount?: number }} props
 *   amount — how much of the container must be visible before triggering (default 0.08)
 */
export function StaggerReveal({ children, className = '', amount = 0.08 }) {
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  )
}

/**
 * A single item inside a <StaggerReveal> container.
 * Renders as a motion.div — pass className to control layout.
 */
export function StaggerItem({ children, className = '' }) {
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
