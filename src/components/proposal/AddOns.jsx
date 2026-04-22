import { StaggerReveal, StaggerItem } from './StaggerReveal'

function AddOns({ addOns }) {
  if (!addOns || addOns.length === 0) return null

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(n)

  return (
    <section className="animate-fade-up-delay2 px-7 py-10 bg-dark-900">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-green mb-3.5 flex items-center gap-2">
          <span className="w-[18px] h-0.5 bg-brand-green rounded-sm block" />
          Recommended Add-ons
        </h2>

        <StaggerReveal className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {addOns.map((addon) => (
            <StaggerItem key={addon.id} className="bg-dark-700 border border-white/[0.07] rounded-xl p-[18px]">
              <div className="text-sm font-bold mb-1.5">{addon.name}</div>
              <div className="text-[13px] font-bold">
                <span className="gradient-text">{fmt(addon.price)}</span>
                {addon.pricingModel && (
                  <span className="text-[11px] text-text-muted ml-1">
                    {addon.pricingModel}
                  </span>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}

export default AddOns
