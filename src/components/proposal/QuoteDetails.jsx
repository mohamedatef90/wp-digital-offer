import { motion } from 'framer-motion'

const BILLING_CYCLE_LABELS = { mo: 'month', yr: 'year', day: 'day' }

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function QuoteDetails({ lineItems, termMonths, currency, taxNote }) {
  const monthlySubtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const total = monthlySubtotal * termMonths

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(n)

  return (
    <section id="pricing" className="animate-fade-up-delay1 px-7 py-10 bg-dark-900">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-green mb-3.5 flex items-center gap-2">
          <span className="w-[18px] h-0.5 bg-brand-green rounded-sm block" />
          Pricing Summary
        </h2>

        <div className="bg-dark-700 border border-white/[0.07] rounded-[14px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-dark-600">
                  <th className="px-[18px] py-[13px] text-xs font-bold uppercase tracking-[0.07em] text-text-muted text-left border-b-2 border-white/[0.07]">
                    Item
                  </th>
                  <th className="px-[18px] py-[13px] text-xs font-bold uppercase tracking-[0.07em] text-text-muted text-center border-b-2 border-white/[0.07] w-16">
                    Qty
                  </th>
                  <th className="px-[18px] py-[13px] text-xs font-bold uppercase tracking-[0.07em] text-text-muted text-right border-b-2 border-white/[0.07] w-36">
                    Unit Price
                  </th>
                  <th className="px-[18px] py-[13px] text-xs font-bold uppercase tracking-[0.07em] text-brand-green text-right border-b-2 border-white/[0.07] w-36">
                    Line Total
                  </th>
                </tr>
              </thead>
              <motion.tbody>
                {lineItems.map((item, index) => {
                  const lineTotal = item.quantity * item.unitPrice
                  return (
                    <motion.tr
                      key={item.id}
                      className="border-b border-white/[0.04] last:border-b-0 transition-colors duration-150 hover:bg-white/[0.03]"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <td className="px-[18px] py-4">
                        <div className="text-sm font-bold text-text-primary">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-[18px] py-4 text-[13px] text-text-secondary text-center tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="px-[18px] py-4 text-[13px] text-text-secondary text-right tabular-nums">
                        {fmt(item.unitPrice)}
                        <div className="text-xs text-text-muted mt-0.5">
                          per {BILLING_CYCLE_LABELS[item.billingCycle] ?? item.billingCycle}
                        </div>
                      </td>
                      <td className="px-[18px] py-4 text-sm font-bold text-brand-green-light text-right tabular-nums">
                        {fmt(lineTotal)}
                        <div className="text-xs text-text-muted font-normal mt-0.5">
                          {termMonths}-month term
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </motion.tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="px-[18px] py-[18px] border-t border-white/[0.07] bg-dark-600">
            <div className="flex justify-between text-[13px] text-text-secondary mb-2">
              <span>Monthly subtotal</span>
              <span className="tabular-nums">{fmt(monthlySubtotal)}</span>
            </div>
            <div className="flex justify-between text-[13px] text-text-secondary mb-2">
              <span>{termMonths}-month contract subtotal</span>
              <span className="tabular-nums">{fmt(total)}</span>
            </div>
            <div className="text-xs text-text-muted italic mt-2 px-2 py-1.5 bg-white/[0.04] rounded-md">
              {taxNote}
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-white/[0.07] mt-3">
              <span className="text-lg font-extrabold text-text-primary">
                Contract total
                <span className="block text-xs font-normal text-text-muted mt-0.5">{termMonths} months</span>
              </span>
              <span className="text-2xl font-extrabold text-brand-green-light tabular-nums">
                {fmt(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuoteDetails
