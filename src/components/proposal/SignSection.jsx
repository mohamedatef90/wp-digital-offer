import { useState } from 'react'
import { CheckCircle, Loader2, Rocket } from 'lucide-react'
import toast from 'react-hot-toast'

function SignSection() {
  const [signature, setSignature] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [acceptedAt] = useState(() => new Date())

  const isEnabled = signature.trim().length > 0 && agreed

  const handleSubmit = async () => {
    if (!isEnabled) return
    setSubmitting(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again or contact your account manager.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section id="sign" className="px-7 pt-12 pb-10 bg-dark-800">
        <div className="max-w-[600px] mx-auto text-center">
          <div
            role="status"
            aria-live="polite"
            className="animate-scale-up-fade bg-dark-700 border border-brand-green/30 rounded-[18px] p-9"
          >
            <CheckCircle size={40} className="animate-icon-pop text-brand-green mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Proposal Accepted</h2>
            <p className="text-sm text-text-secondary mb-1">
              Signed by <span className="font-semibold text-text-primary">{signature}</span>
            </p>
            <p className="text-[11px] text-text-muted mb-6">
              {acceptedAt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}
              {acceptedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="text-xs text-text-muted bg-dark-600 rounded-xl px-5 py-4 text-left leading-relaxed">
              Your account manager will be in touch within 1 business day to confirm next steps and coordinate onboarding.
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="sign" className="px-7 pt-12 pb-10 bg-dark-800">
      <div className="max-w-[600px] mx-auto text-center">
        <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-green mb-3.5 flex items-center gap-2 justify-center">
          <span className="w-[18px] h-0.5 bg-brand-green rounded-sm block" />
          One Step Away
        </div>

        <div className="bg-dark-700 border border-brand-green/[0.22] rounded-[18px] p-9">
          <h2 className="text-xl font-bold mb-2">Ready to Get Started?</h2>
          <p className="text-[13px] text-text-muted mb-6">
            Sign below to lock in your offer and kick off onboarding — your team will be up and running in no time.
          </p>

          <div className="mb-3.5">
            <label htmlFor="signature" className="sr-only">
              Full legal name (required) <span aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                id="signature"
                type="text"
                autoComplete="name"
                inputMode="text"
                placeholder="Your full legal name"
                required
                aria-required="true"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full bg-dark-600 border border-white/[0.12] text-text-primary text-lg font-bold px-[18px] py-3.5 rounded-[9px] outline-none font-[inherit] text-center focus:border-brand-green/50 focus-visible:ring-2 focus-visible:ring-brand-green/60 transition-colors"
              />
              <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">*</span>
            </div>
          </div>

          <label className="flex items-start gap-2.5 mb-5 text-[13px] text-text-secondary text-left cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-brand-green"
            />
            <span>
              I confirm I am authorised to accept this proposal on behalf of my
              organisation, and agree to the pricing, service terms, and SLA
              commitments detailed above.
            </span>
          </label>

          <button
            disabled={!isEnabled || submitting}
            onClick={handleSubmit}
            className={`w-full border-none px-6 py-4 rounded-xl text-base font-extrabold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-green/60 focus-visible:outline-none ${
              isEnabled && !submitting
                ? 'bg-gradient-to-br from-brand-blue to-brand-green text-white cursor-pointer hover:opacity-90 active:scale-[0.97]'
                : 'bg-dark-600 text-text-muted cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Submitting…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Rocket size={16} strokeWidth={2.5} />
                Yes, I&apos;m In — Let&apos;s Get Started!
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

export default SignSection
