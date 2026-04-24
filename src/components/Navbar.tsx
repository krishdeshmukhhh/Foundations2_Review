import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { topics } from '../data/topics'

export function Navbar() {
  const [open, setOpen] = useState(false)

  // Close on scroll or resize to desktop
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] font-bold">
              Foundations II
            </div>
            <div className="h-4 w-[1px] bg-[var(--color-border)]" />
            <span className="text-sm font-medium tracking-wide text-[var(--color-text-primary)]">
              Exam Archive
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.1em] font-bold text-[var(--color-text-secondary)]">
            <a href="#topics" className="hover:text-[var(--color-text-primary)] transition-colors">Topics</a>
            <a href="#final-review" className="hover:text-[var(--color-text-primary)] transition-colors">Final Review</a>
          </nav>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden w-9 h-9 flex items-center justify-center border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-border-hover)] transition-all"
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 z-50 bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] flex flex-col md:hidden transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)]">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)]">Index</span>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto py-4 px-4" style={{ scrollbarWidth: 'none' }}>
          <div className="flex flex-col gap-0.5">
            {topics.map(topic => (
              <a
                key={topic.id}
                href={`#${topic.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-sm rounded text-[var(--color-text-secondary)] hover:text-white hover:bg-white/[0.04] transition-all font-medium"
              >
                <span>{topic.title}</span>
                <span className="text-[10px] tabular-nums text-[var(--color-text-muted)] ml-2">
                  {topic.files.notes.length + topic.files.questions.length + topic.files.reviewQuestions.length}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <a
              href="#final-review"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 text-sm rounded text-[var(--color-text-secondary)] hover:text-white hover:bg-white/[0.04] transition-all font-bold"
            >
              <span>Final Exam Reviews</span>
              <span className="text-[10px] tabular-nums text-[var(--color-text-muted)] ml-2">
                {topics.flatMap(t => t.files.reviewQuestions).length}
              </span>
            </a>
          </div>
        </nav>

        {/* Drawer footer */}
        <div className="px-6 py-5 border-t border-[var(--color-border)]">
          <p className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">
            Foundations II Archive
          </p>
        </div>
      </div>
    </>
  )
}
