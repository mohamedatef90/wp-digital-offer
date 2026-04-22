function TrustedBy({ companyName, logos }) {
  // Duplicate real logos enough times to fill the track (min 8 per half)
  const minCopies = logos.length > 0 ? Math.ceil(8 / logos.length) : 1
  const base = Array.from({ length: minCopies }, () => logos).flat()

  // Two identical halves so translateX(-50%) creates a seamless loop
  const displayLogos = [...base, ...base]

  return (
    <section className="animate-fade-up py-10 bg-gradient-to-br from-dark-900 to-dark-800 overflow-hidden">
      <div className="text-center mb-7 px-5">
        <h2 className="text-[clamp(22px,3.2vw,32px)] font-extrabold text-text-primary mb-2">
          Trusted By <span className="text-brand-green">Leading Organizations</span>
        </h2>
        <p className="text-sm text-text-secondary max-w-[560px] mx-auto">
          Enterprises worldwide rely on {companyName} for their critical infrastructure
        </p>
      </div>

      {/* Full-width track — no horizontal padding, fade edges via mask */}
      <div
        className="relative overflow-hidden py-3 w-full"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)',
        }}
      >
        <div className="logo-track">
          {displayLogos.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="shrink-0 w-[160px] h-[72px] flex items-center justify-center bg-dark-700 border border-white/[0.07] rounded-lg p-3 transition-all duration-300 hover:bg-dark-600 hover:border-brand-green hover:scale-105 max-md:w-[120px] max-md:h-[56px] max-md:p-2"
              title={logo.name}
            >
              <img
                src={logo.url}
                alt={logo.name}
                loading="lazy"
                className="max-w-full max-h-full object-contain grayscale brightness-[0.85] opacity-85 transition-[filter] duration-300 hover:grayscale-0 hover:brightness-100 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustedBy
