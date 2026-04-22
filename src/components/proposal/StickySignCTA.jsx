import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Rocket } from 'lucide-react'

/**
 * Floating "Accept Proposal" pill that appears once the user has scrolled
 * 25% of the page, and hides again when the #sign section is close to entering
 * the viewport (so it never competes with the actual sign form).
 *
 * Positioned bottom-center so it doesn't collide with ChatButton (bottom-right).
 */
export function StickySignCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const check = () => {
      const { scrollY, innerHeight } = window
      const total = document.documentElement.scrollHeight - innerHeight
      const pct = total > 0 ? scrollY / total : 0

      const signEl = document.getElementById('sign')
      const nearSign = signEl
        ? signEl.getBoundingClientRect().top < innerHeight * 0.85
        : false

      setVisible(pct > 0.25 && !nearSign)
    }

    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-sign"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 z-[250] -translate-x-1/2 pointer-events-auto"
        >
          <a
            href="#sign"
            aria-label="Jump to sign and accept the proposal"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white text-[13px] font-bold px-5 py-3 rounded-full shadow-[0_8px_32px_rgba(103,154,65,0.4)] transition-all duration-200 no-underline whitespace-nowrap hover:shadow-[0_12px_40px_rgba(103,154,65,0.5)] active:scale-[0.97]"
          >
            <Rocket size={14} strokeWidth={2.5} />
            Accept &amp; Get Started
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
