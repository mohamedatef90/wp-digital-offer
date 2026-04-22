import toast from 'react-hot-toast'

function NegotiateButton() {
  const handleNegotiate = () => {
    // TODO: Replace with counter-offer modal or form
    toast('Your account manager has been notified. They will follow up with you on your counter-offer request.')
  }
  return (
    <section className="px-7 pt-10 pb-12 bg-dark-900">
      <div className="max-w-[900px] mx-auto">
        <div className="bg-dark-800 border border-white/[0.07] rounded-[14px] px-7 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm font-bold text-text-primary mb-1">
              Not quite right?
            </div>
            <div className="text-xs text-text-muted">
              Submit a counter-offer and we&apos;ll review it with you.
            </div>
          </div>
          <button
            onClick={handleNegotiate}
            className="shrink-0 bg-transparent border border-brand-blue/40 text-brand-blue px-5 py-2.5 rounded-[10px] text-[13px] font-bold cursor-pointer transition-all duration-200 hover:bg-brand-blue/10 hover:border-brand-blue/70 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none whitespace-nowrap"
          >
            Submit a Counter-Offer
          </button>
        </div>
      </div>
    </section>
  )
}

export default NegotiateButton
