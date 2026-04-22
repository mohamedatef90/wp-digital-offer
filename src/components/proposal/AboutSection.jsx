import { Users, Zap, Globe, Headphones, HelpCircle, BadgeCheck } from 'lucide-react'
import { StaggerReveal, StaggerItem } from './StaggerReveal'

const STAT_ICONS = { Users, Zap, Globe, Headphones }

function AboutSection({ company }) {
  return (
    <section className="animate-fade-up max-w-[960px] mx-auto px-5 py-10">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-[30px] h-0.5 bg-brand-green" />
        <h2 className="text-[11px] font-bold text-brand-green uppercase tracking-[0.1em]">
          About {company.name.split(' ')[0]}
        </h2>
      </div>

      <div className="bg-dark-800 border border-white/[0.07] rounded-[14px] overflow-hidden">

        <div className="px-8 pt-7 pb-6">
          <p className="text-sm text-text-secondary leading-7 max-w-[680px]">
            {company.description}
          </p>
        </div>

        <StaggerReveal className="border-t border-white/[0.07] grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
          {company.stats.map((stat, i) => {
            const Icon = STAT_ICONS[stat.icon] || HelpCircle
            return (
              <StaggerItem key={i} className="px-6 py-5">
                <div className="text-[11px] text-text-muted uppercase tracking-[0.08em] font-medium mb-2">
                  {stat.label}
                </div>
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-brand-green shrink-0" strokeWidth={2} />
                  <span className="text-xl font-extrabold text-text-primary leading-none tabular-nums">
                    {stat.value}
                  </span>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerReveal>

        <StaggerReveal className="border-t border-white/[0.07] px-8 py-5 flex flex-wrap gap-2">
          {company.certifications.map((cert, i) => (
            <StaggerItem key={i}>
              <span className="inline-flex items-center gap-1.5 bg-brand-green/[0.08] border border-brand-green/20 text-brand-green px-3 py-1.5 rounded-lg text-xs font-semibold">
                <BadgeCheck size={13} strokeWidth={2} />
                {cert}
              </span>
            </StaggerItem>
          ))}
        </StaggerReveal>

      </div>
    </section>
  )
}

export default AboutSection
