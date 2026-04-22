import { useRef } from 'react'
import { motion as Motion, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Fixed frame so client + company logos always share the same on-screen size
const LOGO_FRAME =
  'h-16 w-[200px] shrink-0 flex items-center justify-center rounded-[10px]'

function LogoLockup({ label, imageUrl, alt, placeholderId, whiteInDarkMode, isDark }) {
  const whiteOnDark =
    Boolean(imageUrl) && whiteInDarkMode && isDark

  return imageUrl ? (
    <div className={`${LOGO_FRAME} overflow-hidden`}>
      <img
        src={imageUrl}
        alt={alt}
        className={`max-h-full max-w-full object-contain object-center ${
          whiteOnDark ? 'brightness-0 invert' : ''
        }`}
        loading="eager"
        decoding="async"
      />
    </div>
  ) : (
    <div
      className={`${LOGO_FRAME} border border-dashed border-white/[0.15] bg-dark-800`}
      aria-label={`${label} logo placeholder`}
    >
      <span className="text-[11px] font-semibold tracking-widest uppercase text-text-muted select-none text-center px-1">
        {placeholderId}
      </span>
    </div>
  )
}

function HeroSection({ proposalNumber, clientName, clientLogo, companyName, companyLogo, isDark = true }) {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  // As hero scrolls away: content fades out and drifts up slightly
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section ref={sectionRef} aria-label="Proposal hero" className="animate-fade-up">
      <AuroraBackground
        isDark={isDark}
        showRadialGradient
        className="px-7 py-[52px] min-h-[60vh] justify-center"
      >
        {/* Scroll-out wrapper — fades content as hero scrolls away */}
        <Motion.div
          className="relative z-[1] w-full max-w-[700px] mx-auto text-center"
          style={prefersReducedMotion ? undefined : { opacity: scrollOpacity, y: scrollY }}
        >
        {/* Entrance animation wrapper */}
        <Motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-green mb-3.5 flex items-center gap-2 justify-center">
            <span className="w-[18px] h-0.5 bg-brand-green rounded-sm block" />
            Proposal &middot; {proposalNumber}
          </div>

          <div
            className="flex items-center justify-center gap-5 sm:gap-8 mb-5 flex-wrap"
            role="group"
            aria-label="Client and company logos"
          >
            <LogoLockup
              label="Client"
              imageUrl={clientLogo}
              alt={clientName ? `${clientName} logo` : 'Client company logo'}
              placeholderId="Client"
            />
            <div
              className={`hidden sm:flex h-16 w-px shrink-0 self-center ${isDark ? 'bg-white/[0.1]' : 'bg-black/[0.1]'}`}
              aria-hidden
            />
            <span className="sm:hidden text-text-muted/50 text-sm leading-none select-none" aria-hidden>
              ·
            </span>
            <LogoLockup
              label="Your company"
              imageUrl={companyLogo}
              alt={companyName ? `${companyName} logo` : 'Your company logo'}
              placeholderId="Ours"
              whiteInDarkMode
              isDark={isDark}
            />
          </div>

          <h1 className="mb-4">
            <span className="block text-xs sm:text-sm font-bold uppercase tracking-[0.12em] text-text-secondary mb-2.5">
              Prepared for
            </span>
            <span className="block text-[clamp(28px,4.5vw,48px)] font-extrabold leading-[1.1] text-text-primary">
              {clientName}
            </span>
          </h1>

          <p className="text-[17px] text-text-secondary leading-[1.75] mx-auto max-w-[520px]">
            This proposal covers your WorldPosta service terms — pricing, SLA
            commitments, and compliance coverage. Review the details and sign
            below to proceed.
          </p>
        </Motion.div>
        </Motion.div>
      </AuroraBackground>
    </section>
  )
}

export default HeroSection
