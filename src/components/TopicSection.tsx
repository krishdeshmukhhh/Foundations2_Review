import { FileCard } from './FileCard'
import { Check } from 'lucide-react'

interface FileDef {
  title: string
  path: string
  solutionPath?: string
}

interface TopicFiles {
  notes: FileDef[]
  questions: FileDef[]
  reviewQuestions: FileDef[]
  solutions: FileDef[]
}

interface TopicSectionProps {
  id: string
  title: string
  files: TopicFiles
  order: number
  isCompleted: boolean
  onToggle: () => void
}

export function TopicSection({ id, title, files, order, isCompleted, onToggle }: TopicSectionProps) {
  const hasNotes = files.notes.length > 0
  const hasQuestions = files.questions.length > 0
  const hasReview = files.reviewQuestions.length > 0

  if (!hasNotes && !hasQuestions && !hasReview) return null

  const formatOrder = (num: number) => num.toString().padStart(2, '0')

  return (
    <section id={id} className={`scroll-mt-32 mb-28 relative topic-section pl-6 md:pl-12 border-l transition-colors duration-300 ${isCompleted ? 'border-white/20' : 'border-[var(--color-border)]'}`}>
      {/* Order number / completion dot */}
      <div
        className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full mt-[6px] flex items-center justify-center transition-colors duration-300 ${isCompleted ? 'bg-white' : 'bg-[var(--color-border)]'}`}
      />
      <div className="absolute -left-8 top-0 text-xs font-bold text-[var(--color-text-muted)] tracking-wider tabular-nums mt-0.5 hidden md:block">
        {formatOrder(order)}
      </div>

      <div className="mb-10 flex items-start justify-between gap-4">
        <h2 className={`text-2xl font-semibold tracking-tight transition-colors duration-300 ${isCompleted ? 'text-[var(--color-text-muted)] line-through decoration-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]'}`}>
          {title}
        </h2>
        <button
          onClick={onToggle}
          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border transition-all duration-200 ${
            isCompleted
              ? 'bg-white border-white text-black'
              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-white hover:text-white'
          }`}
        >
          <Check size={11} />
          {isCompleted ? 'Done' : 'Mark done'}
        </button>
      </div>

      <div className="space-y-10">
        {hasNotes && (
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-2" style={{ color: '#76a8ff' }}>
              <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: '#76a8ff', boxShadow: '0 0 6px #76a8ff99' }} />
              Course Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {files.notes.map((file, i) => (
                <FileCard key={i} title={file.title} path={file.path} type="notes" />
              ))}
            </div>
          </div>
        )}

        {hasQuestions && (
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-2" style={{ color: '#edc5ffff' }}>
              <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: '#df9aff', boxShadow: '0 0 6px #df9aff99' }} />
              Practice Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {files.questions.map((file, i) => (
                <FileCard key={i} title={file.title} path={file.path} solutionPath={file.solutionPath} type="questions" />
              ))}
            </div>
          </div>
        )}

        {hasReview && (
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-2" style={{ color: '#456e4b' }}>
              <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: '#456e4b', boxShadow: '0 0 6px #456e4b99' }} />
              Final Review
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {files.reviewQuestions.map((file, i) => (
                <FileCard key={i} title={file.title} path={file.path} solutionPath={file.solutionPath} type="review" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
