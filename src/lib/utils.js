import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes without conflicting utilities (shadcn-style) */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
