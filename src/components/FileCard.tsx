import { ArrowRight, ArrowUpRight } from 'lucide-react'

interface FileCardProps {
  title: string
  path: string
  solutionPath?: string
  type?: 'notes' | 'questions' | 'review'
}

export function FileCard({ title, path, solutionPath, type }: FileCardProps) {
  return (
    <div className="file-card group relative flex flex-col justify-between p-6 rounded-2xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-2 font-bold">
            {type === 'notes' ? 'Notes' : type === 'questions' ? 'Practice' : 'Review'}
          </div>
          <h4 className="font-medium text-base text-[var(--color-text-primary)] leading-tight group-hover:text-white transition-colors max-w-[85%]">
            {title}
          </h4>
        </div>
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 shrink-0 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 transform group-hover:scale-105"
        >
          <ArrowUpRight size={18} />
        </a>
      </div>
      
      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 relative z-10">
        <span className="text-[11px] font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">PDF Format</span>
        {solutionPath && (
          <a
            href={solutionPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-[var(--color-text-secondary)] hover:text-white transition-colors"
          >
            <span>Solutions</span>
            <ArrowRight size={14} />
          </a>
        )}
      </div>
    </div>
  )
}
