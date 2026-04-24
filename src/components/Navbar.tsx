import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] font-bold">
            Foundations II
          </div>
          <div className="h-4 w-[1px] bg-[var(--color-border)]"></div>
          <span className="text-sm font-medium tracking-wide text-[var(--color-text-primary)]">
            Exam Archive
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.1em] font-bold text-[var(--color-text-secondary)]">
          <a href="#topics" className="hover:text-[var(--color-text-primary)] transition-colors">Topics</a>
          <a href="#final-review" className="hover:text-[var(--color-text-primary)] transition-colors">Final Review</a>
        </nav>
      </div>
    </header>
  )
}
