import { Sun, Moon, Monitor } from 'lucide-react'

const THEME_META = {
  dark:  { Icon: Moon,    label: 'Dark',  next: 'light' },
  light: { Icon: Sun,     label: 'Light', next: 'auto'  },
  auto:  { Icon: Monitor, label: 'Auto',  next: 'dark'  },
}

function Navbar({ companyName, recipientName, themePreference = 'dark', onCycleTheme }) {
  const meta = THEME_META[themePreference] ?? THEME_META.dark
  const ThemeIcon = meta.Icon

  return (
    // Navbar is always dark regardless of page theme — white logo requires dark bg
    <nav className="fixed top-0 left-0 right-0 z-[200] h-[54px] bg-[#0f1318]/[0.96] backdrop-blur-[20px] border-b border-white/[0.07] flex items-center px-7">
      <a
        href="#sign"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[300] focus:bg-dark-700 focus:text-text-primary focus:px-3 focus:py-1.5 focus:rounded focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-brand-green/60"
      >
        Skip to sign proposal
      </a>

      {/* Left — recipient */}
      <span className="flex-1 text-[11px] text-white/40">
        For {recipientName}
      </span>

      {/* Center — logo */}
      <img src="/wp-logo-white.png" alt={companyName} className="h-6 w-auto absolute left-1/2 -translate-x-1/2" />

      {/* Right — nav links + theme toggle */}
      <div className="flex-1 flex justify-end items-center gap-1">
        <div className="hidden sm:flex items-center gap-1">
          <a
            href="#pricing"
            className="text-[12px] font-semibold text-white/40 px-3 py-1.5 rounded-lg hover:text-white/70 hover:bg-white/[0.06] transition-colors no-underline"
          >
            Pricing
          </a>
          <a
            href="#sign"
            className="text-[12px] font-semibold text-brand-green px-3 py-1.5 rounded-lg border border-brand-green/30 hover:bg-brand-green/10 transition-colors no-underline"
          >
            Accept Offer
          </a>
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={onCycleTheme}
          aria-label={`Switch theme (current: ${meta.label})`}
          title={`Theme: ${meta.label} — click to switch`}
          className="ml-2 w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-colors"
        >
          <ThemeIcon size={14} strokeWidth={2} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
