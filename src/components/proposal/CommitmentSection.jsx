import { Check } from 'lucide-react'
import { StaggerReveal, StaggerItem } from './StaggerReveal'

function CommitmentSection({ commitments }) {
  return (
    <section className="max-w-[960px] mx-auto px-5 py-10">
      <div className="flex items-center gap-2.5 mb-[18px]">
        <div className="w-[30px] h-0.5 bg-brand-green" />
        <h2 className="text-[11px] font-bold text-brand-green uppercase tracking-[0.1em]">
          Our Commitment to You
        </h2>
      </div>

      <div className="bg-dark-800 border border-white/[0.07] rounded-[14px] px-7 py-6">
        <StaggerReveal className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {commitments.map((item, i) => (
            <StaggerItem key={i} className="flex gap-3 items-start">
              <div className="shrink-0 w-7 h-7 rounded-lg bg-brand-green/15 border border-brand-green/40 text-brand-green flex items-center justify-center">
                <Check size={14} />
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary mb-1">
                  {item.title}
                </div>
                <div className="text-xs text-text-muted leading-[1.5]">
                  {item.description}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}

export default CommitmentSection
