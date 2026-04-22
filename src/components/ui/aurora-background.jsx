import { cn } from '@/lib/utils'

/**
 * Aurora mesh background (shadcn-style). Set `isDark` so Tailwind `dark:` classes
 * line up with the proposal’s resolved theme (this app uses `data-theme`, not
 * a global `html.dark` by default).
 */
export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  isDark = true,
  ...props
}) {
  return (
    <div
      className={cn(
        isDark && 'dark',
        'relative flex w-full min-h-[60vh] flex-col items-center justify-center overflow-hidden',
        isDark
          ? 'bg-dark-900 text-text-primary'
          : 'bg-zinc-50 text-slate-950',
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0
            after:[background-image:var(--white-gradient),var(--aurora)]
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform
            motion-reduce:opacity-0 motion-reduce:after:opacity-0`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        />
      </div>
      {children}
    </div>
  )
}
