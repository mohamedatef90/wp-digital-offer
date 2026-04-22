import { useEffect, useRef, useState } from 'react'

/**
 * Thin progress bar fixed just below the navbar, showing reading progress.
 * Reads brand-green from CSS token so it respects light/dark theme.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const { scrollY, innerHeight } = window
      const total = document.documentElement.scrollHeight - innerHeight
      setProgress(total > 0 ? Math.min(100, (scrollY / total) * 100) : 0)
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        update()
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className="fixed top-[54px] left-0 right-0 z-[190] h-[2px] pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page reading progress"
    >
      <div
        className="h-full bg-brand-green"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
