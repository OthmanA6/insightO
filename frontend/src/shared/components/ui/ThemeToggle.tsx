import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

// ─── Store ──────────────────────────────────────────────────────────────────

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'insighto-theme'
const listeners = new Set<() => void>()

function readTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function commitTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(STORAGE_KEY, theme)
  listeners.forEach((l) => l())
}

function setTheme(theme: Theme) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof document.startViewTransition !== 'function' || reduceMotion) {
    commitTheme(theme)
    return
  }
  document.startViewTransition(() => flushSync(() => commitTheme(theme)))
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light' as Theme)
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  return { theme, toggleTheme, setTheme }
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface ThemeToggleProps {
  /** Additional Tailwind classes for the button */
  className?: string
  /** Accessible label (defaults to 'Toggle theme') */
  label?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * `ThemeToggle` – Syncs `.dark` on `<html>` with localStorage.
 * Every instance shares one store, so toggles anywhere stay in agreement.
 *
 * @example
 * <ThemeToggle className="ms-auto" />
 */
export function ThemeToggle({ className, label = 'Toggle theme' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      id="theme-toggle"
      type="button"
      aria-label={label}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-full touch-manipulation',
        'bg-fill text-content-muted hover:bg-fill-strong hover:text-content',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25',
        'transition-[scale,background-color,color] duration-200 active:scale-90 active:duration-75',
        className
      )}
    >
      <Sun
        aria-hidden="true"
        className={cn(
          'absolute size-4 transition-[rotate,scale,opacity] duration-300 ease-fluid',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          'absolute size-4 transition-[rotate,scale,opacity] duration-300 ease-fluid',
          isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
        )}
      />
    </button>
  )
}
