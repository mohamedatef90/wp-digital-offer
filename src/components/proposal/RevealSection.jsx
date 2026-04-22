import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Wraps a proposal section in a scroll-triggered entrance reveal.
 *
 * Starts invisible (opacity 0 + translateY) and transitions to visible
 * when 6% of the element enters the viewport. Fires once then disconnects.
 *
 * Respects prefers-reduced-motion: reveals instantly with no transform.
 *
 * @param {{ delay?: number, className?: string, children: React.ReactNode }} props
 *   delay — extra delay in ms (for subtle stagger between sibling sections)
 */
export function RevealSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion) return
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -32px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={
        prefersReducedMotion
          ? undefined
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(22px)',
              transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            }
      }
    >
      {children}
    </div>
  )
}
