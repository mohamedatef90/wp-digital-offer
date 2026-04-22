import {
  Mail, Shield, Zap, Lock, Link2,
  Check, X, HelpCircle,
  Target, ShieldCheck, Activity,
  Building2, Settings2, Users,
} from 'lucide-react'

// ── Icon registry (extend as needed) ────────────────────────────────────────
const ICONS = {
  Mail, Shield, Zap, Lock, Link2,
  Target, ShieldCheck, Activity,
  Building2, Settings2, Users,
  HelpCircle,
}

function Icon({ name, size = 18, className = '', strokeWidth = 2 }) {
  const Ic = ICONS[name] || HelpCircle
  return <Ic size={size} className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}

function BlockHeading({ text }) {
  if (!text) return null
  return (
    <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.08em] mb-3">
      {text}
    </p>
  )
}

// ── Block: features ──────────────────────────────────────────────────────────

function FeaturesGrid({ block }) {
  return (
    <div>
      <BlockHeading text={block.heading} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {block.items.map((feature, i) => (
          <div key={i} className="bg-dark-700 border border-white/[0.07] rounded-xl px-5 py-4">
            <div className="mb-2.5 text-brand-blue">
              <Icon name={feature.icon} size={18} />
            </div>
            <h3 className="text-sm font-bold text-text-primary mb-1.5">{feature.title}</h3>
            <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesList({ block }) {
  return (
    <div>
      <BlockHeading text={block.heading} />
      <div className="flex flex-col divide-y divide-white/[0.06]">
        {block.items.map((feature, i) => (
          <div key={i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="w-9 h-9 rounded-xl bg-dark-700 border border-white/[0.07] flex items-center justify-center text-brand-blue shrink-0">
              <Icon name={feature.icon} size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-1">{feature.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesCompact({ block }) {
  return (
    <div>
      <BlockHeading text={block.heading} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {block.items.map((feature, i) => (
          <div key={i} className="bg-dark-700 border border-white/[0.07] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="text-brand-blue shrink-0">
              <Icon name={feature.icon} size={15} />
            </div>
            <h3 className="text-sm font-semibold text-text-primary leading-snug">{feature.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesBlock({ block }) {
  const layout = block.layout || 'grid'
  if (layout === 'list')    return <FeaturesList block={block} />
  if (layout === 'compact') return <FeaturesCompact block={block} />
  return <FeaturesGrid block={block} />
}

// ── Block: why_choose ────────────────────────────────────────────────────────

function WhyChooseList({ block }) {
  return (
    <div className="bg-dark-700 border border-white/[0.07] rounded-xl px-6 py-5">
      {block.heading && (
        <p className="text-[11px] font-bold text-brand-green uppercase tracking-[0.08em] mb-4">
          {block.heading}
        </p>
      )}
      <ul className="flex flex-col gap-3" role="list">
        {block.items.map((reason, i) => (
          <li key={i} className="flex gap-3 items-start text-sm text-text-secondary leading-relaxed">
            <Check size={14} className="text-brand-green shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function WhyChooseCards({ block }) {
  return (
    <div>
      {block.heading && (
        <p className="text-[11px] font-bold text-brand-green uppercase tracking-[0.08em] mb-3">
          {block.heading}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {block.items.map((reason, i) => (
          <div key={i} className="bg-dark-700 border border-white/[0.07] rounded-xl px-5 py-4 flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-green/15 border border-brand-green/30 flex items-center justify-center shrink-0 mt-0.5">
              <Check size={11} className="text-brand-green" strokeWidth={2.5} />
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{reason}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function WhyChoosePills({ block }) {
  return (
    <div>
      {block.heading && (
        <p className="text-[11px] font-bold text-brand-green uppercase tracking-[0.08em] mb-3">
          {block.heading}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {block.items.map((reason, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-green/10 border border-brand-green/20 rounded-full text-sm text-brand-green font-medium"
          >
            <Check size={12} strokeWidth={2.5} />
            {reason}
          </span>
        ))}
      </div>
    </div>
  )
}

function WhyChooseBlock({ block }) {
  const layout = block.layout || 'list'
  if (layout === 'cards') return <WhyChooseCards block={block} />
  if (layout === 'pills') return <WhyChoosePills block={block} />
  return <WhyChooseList block={block} />
}

// ── Block: highlights ────────────────────────────────────────────────────────

function HighlightsStrip({ block }) {
  return (
    <div>
      <BlockHeading text={block.heading} />
      <div className="bg-dark-700 border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.07]">
          {block.items.map((item, i) => (
            <div key={i} className="px-5 py-4">
              <div className="text-[11px] text-text-muted uppercase tracking-[0.08em] font-medium mb-2">
                {item.label}
              </div>
              <div className="flex items-center gap-2">
                <Icon name={item.icon} size={14} className="text-brand-green shrink-0" strokeWidth={2} />
                <span className="text-xl font-extrabold text-text-primary leading-none tabular-nums">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HighlightsCards({ block }) {
  return (
    <div>
      <BlockHeading text={block.heading} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {block.items.map((item, i) => (
          <div key={i} className="bg-dark-700 border border-white/[0.07] rounded-xl px-4 py-5 flex flex-col items-center text-center gap-2">
            <Icon name={item.icon} size={20} className="text-brand-green" strokeWidth={2} />
            <span className="text-2xl font-extrabold text-text-primary tabular-nums leading-none">
              {item.value}
            </span>
            <span className="text-[11px] text-text-muted uppercase tracking-[0.08em] font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HighlightsBlock({ block }) {
  const layout = block.layout || 'strip'
  if (layout === 'cards') return <HighlightsCards block={block} />
  return <HighlightsStrip block={block} />
}

// ── Block: comparison ────────────────────────────────────────────────────────
// Competitor table — first column is always the vendor (brand-green highlight)
function ComparisonBlock({ block }) {
  return (
    <div>
      <BlockHeading text={block.heading} />
      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full border-collapse text-sm" aria-label={block.heading || 'Comparison table'}>
          <thead>
            <tr className="border-b border-white/[0.07]">
              <th
                scope="col"
                className="px-5 py-3.5 text-left text-xs font-semibold text-text-muted uppercase tracking-[0.07em] bg-dark-800 min-w-[180px]"
              >
                Feature
              </th>
              {block.columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`px-5 py-3.5 text-center text-xs font-bold uppercase tracking-[0.07em] ${
                    i === 0
                      ? 'bg-brand-green/[0.08] text-brand-green border-x border-brand-green/20'
                      : 'bg-dark-800 text-text-muted'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr
                key={ri}
                className={`border-b border-white/[0.05] last:border-0 ${ri % 2 === 0 ? 'bg-dark-800' : 'bg-dark-700/40'}`}
              >
                <td className="px-5 py-3 text-sm text-text-secondary font-medium">
                  {row.feature}
                </td>
                {row.values.map((val, vi) => (
                  <td
                    key={vi}
                    className={`px-5 py-3 text-center ${
                      vi === 0 ? 'bg-brand-green/[0.06] border-x border-brand-green/15' : ''
                    }`}
                  >
                    {val ? (
                      <Check
                        size={15}
                        className={vi === 0 ? 'text-brand-green mx-auto' : 'text-text-muted mx-auto'}
                        strokeWidth={2.5}
                        aria-label="Yes"
                      />
                    ) : (
                      <X
                        size={14}
                        className="text-red-400/50 mx-auto"
                        strokeWidth={2}
                        aria-label="No"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Block: pricing_comparison ─────────────────────────────────────────────────
// Like comparison but cells hold text/price strings instead of boolean check/X

function PricingComparisonBlock({ block }) {
  return (
    <div>
      <BlockHeading text={block.heading} />
      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full border-collapse text-sm" aria-label={block.heading || 'Pricing comparison'}>
          <thead>
            <tr className="border-b border-white/[0.07]">
              <th
                scope="col"
                className="px-5 py-3.5 text-left text-xs font-semibold text-text-muted uppercase tracking-[0.07em] bg-dark-800 min-w-[180px]"
              />
              {block.columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`px-5 py-3.5 text-center text-xs font-bold uppercase tracking-[0.07em] ${
                    i === 0
                      ? 'bg-brand-green/[0.08] text-brand-green border-x border-brand-green/20'
                      : 'bg-dark-800 text-text-muted'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr
                key={ri}
                className={`border-b border-white/[0.05] last:border-0 ${ri % 2 === 0 ? 'bg-dark-800' : 'bg-dark-700/40'}`}
              >
                <td className="px-5 py-3 text-sm text-text-secondary font-medium">
                  {row.feature}
                </td>
                {row.values.map((val, vi) => (
                  <td
                    key={vi}
                    className={`px-5 py-3 text-center tabular-nums ${
                      vi === 0
                        ? 'bg-brand-green/[0.06] border-x border-brand-green/15 text-brand-green font-bold'
                        : 'text-text-secondary'
                    }`}
                  >
                    {val || <span className="text-text-muted/50">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.note && (
        <p className="text-[11px] text-text-muted mt-2.5 leading-relaxed">{block.note}</p>
      )}
    </div>
  )
}

// ── Block: use_cases ─────────────────────────────────────────────────────────

function UseCasesCards({ block }) {
  return (
    <div>
      <BlockHeading text={block.heading} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {block.items.map((item, i) => (
          <div key={i} className="bg-dark-700 border border-white/[0.07] rounded-xl px-5 py-5">
            <div className="mb-3 text-brand-blue">
              <Icon name={item.icon} size={20} />
            </div>
            <h3 className="text-sm font-bold text-text-primary mb-1.5">{item.title}</h3>
            <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function UseCasesList({ block }) {
  return (
    <div>
      <BlockHeading text={block.heading} />
      <div className="flex flex-col gap-3">
        {block.items.map((item, i) => (
          <div key={i} className="bg-dark-700 border border-white/[0.07] rounded-xl px-5 py-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-dark-600 border border-white/[0.07] flex items-center justify-center text-brand-blue shrink-0">
              <Icon name={item.icon} size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-1">{item.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UseCasesBlock({ block }) {
  const layout = block.layout || 'cards'
  if (layout === 'list') return <UseCasesList block={block} />
  return <UseCasesCards block={block} />
}

// ── Block registry ───────────────────────────────────────────────────────────
const BLOCK_RENDERERS = {
  features:            FeaturesBlock,
  why_choose:          WhyChooseBlock,
  highlights:          HighlightsBlock,
  comparison:          ComparisonBlock,
  pricing_comparison:  PricingComparisonBlock,
  use_cases:           UseCasesBlock,
}

// ── Main section ─────────────────────────────────────────────────────────────
function ProductDetails({ products }) {
  return (
    <section className="animate-fade-up-delay1 max-w-[960px] mx-auto px-5 py-10">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-[30px] h-0.5 bg-brand-blue" />
        <h2 className="text-[11px] font-bold text-brand-blue uppercase tracking-[0.1em]">
          Product Details
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-dark-800 border border-white/[0.07] rounded-[14px] overflow-hidden"
          >
            {/* Product header */}
            <div className="px-8 pt-7 pb-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-dark-700 border border-white/[0.07] flex items-center justify-center text-brand-blue shrink-0 mt-0.5">
                <Icon name={product.icon} size={20} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-text-primary mb-1">
                  {product.name}
                </h2>
                <p className="text-[13px] text-brand-blue font-semibold mb-3">
                  {product.subtitle}
                </p>
                <p className="text-sm text-text-secondary leading-7 max-w-[640px]">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Dynamic content blocks — admin-selected, admin-ordered */}
            {product.contentBlocks && product.contentBlocks.length > 0 && (
              <div className="border-t border-white/[0.07] px-8 py-6 flex flex-col gap-6">
                {product.contentBlocks.map((block, i) => {
                  const Renderer = BLOCK_RENDERERS[block.type]
                  if (!Renderer) return null
                  return <Renderer key={`${block.type}-${i}`} block={block} />
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductDetails
