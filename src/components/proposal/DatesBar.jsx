import { format, differenceInDays, parseISO } from 'date-fns'
import { Calendar } from 'lucide-react'

function DatesBar({ createdAt, validUntil }) {
  const created = parseISO(createdAt)
  const until = parseISO(validUntil)
  const today = new Date()

  const totalDays = differenceInDays(until, created)
  const elapsedDays = differenceInDays(today, created)
  const daysRemaining = differenceInDays(until, today)

  const isExpired = daysRemaining <= 0
  const isUrgent = !isExpired && daysRemaining <= 7

  // Progress: 0–100% of the validity window consumed
  const progress = isExpired
    ? 100
    : Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))

  const progressColor = isExpired
    ? 'bg-red-500'
    : isUrgent
      ? 'bg-amber-400'
      : 'bg-brand-green'

  const badgeClass = isExpired
    ? 'bg-red-500/10 text-red-400 border-red-500/25'
    : isUrgent
      ? 'bg-amber-400/10 text-amber-300 border-amber-400/25'
      : 'bg-brand-blue/10 text-brand-blue border-brand-blue/25'

  const badgeLabel = isExpired
    ? 'Expired'
    : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`

  return (
    <section className="animate-fade-up max-w-[960px] mx-auto px-5 py-8">
      <div className="bg-dark-800 border border-white/[0.07] rounded-xl overflow-hidden">

        {/* Date row */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 flex-wrap">

          {/* Quote Created */}
          <div className="flex items-start gap-3 min-w-[140px]">
            <span className="mt-[1px] text-text-muted shrink-0">
              <Calendar size={14} strokeWidth={1.75} />
            </span>
            <div>
              <div className="text-xs text-text-muted uppercase tracking-[0.08em] mb-0.5 font-medium">
                Quote Created
              </div>
              <div className="text-sm font-bold text-text-primary tabular-nums">
                {format(created, 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          {/* Center divider */}
          <div className="hidden sm:block w-px h-9 bg-white/[0.07] shrink-0" />

          {/* Valid Until + status badge */}
          <div className="flex items-start gap-3 min-w-[140px]">
            <span className={`mt-[1px] shrink-0 ${isExpired ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-text-muted'}`}>
              <Calendar size={14} strokeWidth={1.75} />
            </span>
            <div>
              <div className="text-xs text-text-muted uppercase tracking-[0.08em] mb-0.5 font-medium">
                Valid Until
              </div>
              <div className="text-sm font-bold text-text-primary tabular-nums">
                {format(until, 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          {/* Spacer pushes badge to the right */}
          <div className="hidden sm:block flex-1" />

          {/* Status badge */}
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border tracking-wide ${badgeClass}`}
          >
            {badgeLabel}
          </span>
        </div>

        {/* Validity progress bar */}
        <div className="h-[3px] w-full bg-dark-700">
          <div
            className={`h-full transition-all duration-700 ${progressColor}`}
            style={{ width: `${progress}%`, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            role="meter"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={isExpired ? 'Proposal has expired' : `Proposal validity: ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`}
          />
        </div>

      </div>
    </section>
  )
}

export default DatesBar
