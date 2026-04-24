import { ArrowUpRight, ArrowRight } from 'lucide-react'

interface FileCardProps {
  title: string
  path: string
  solutionPath?: string
  type?: 'notes' | 'questions' | 'review'
}

const typeConfig = {
  notes: {
    label: 'Notes',
    tint: 'rgba(255, 255, 255, 0.03)',
    hoverTint: 'rgba(255, 255, 255, 0.055)',
    dot: '#76a8ffff',   // gray-400
  },
  questions: {
    label: 'Practice',
    tint: 'rgba(255, 255, 255, 0.015)',
    hoverTint: 'rgba(255, 255, 255, 0.04)',
    dot: '#edc5ffff',   // gray-500
  },
  review: {
    label: 'Review',
    tint: 'rgba(255, 255, 255, 0.025)',
    hoverTint: 'rgba(255, 255, 255, 0.05)',
    dot: '#456e4bff',   // gray-300
  },
}

export function FileCard({ title, path, solutionPath, type = 'notes' }: FileCardProps) {
  const cfg = typeConfig[type]

  return (
    <div
      className="file-card group relative flex flex-col justify-between p-5 border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all duration-200 overflow-hidden"
      style={{ background: cfg.tint }}
      onMouseEnter={e => (e.currentTarget.style.background = cfg.hoverTint)}
      onMouseLeave={e => (e.currentTarget.style.background = cfg.tint)}
    >
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}99` }} />
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: cfg.dot }}>
              {cfg.label}
            </span>
          </div>
          <h4 className="font-medium text-sm text-[var(--color-text-secondary)] leading-snug group-hover:text-[var(--color-text-primary)] transition-colors">
            {title}
          </h4>
        </div>
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-8 h-8 border border-[var(--color-border)] bg-transparent flex items-center justify-center text-[var(--color-text-muted)] group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-200"
          title="Open PDF"
        >
          <ArrowUpRight size={15} />
        </a>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] relative z-10">
        <span className="text-[9px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">PDF</span>
        {solutionPath && (
          <a
            href={solutionPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] font-bold text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            Solutions <ArrowRight size={11} />
          </a>
        )}
      </div>
    </div>
  )
}
