import { FileCard } from './FileCard'

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
}

export function TopicSection({ id, title, files, order }: TopicSectionProps) {
  const hasNotes = files.notes.length > 0
  const hasQuestions = files.questions.length > 0
  const hasReview = files.reviewQuestions.length > 0

  if (!hasNotes && !hasQuestions && !hasReview) return null

  const formatOrder = (num: number) => num.toString().padStart(2, '0')

  return (
    <section id={id} className="scroll-mt-32 mb-28 relative topic-section pl-6 md:pl-12 border-l border-[var(--color-border)]">
      {/* Order number */}
      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[var(--color-border)] mt-[6px]" />
      <div className="absolute -left-8 top-0 text-xs font-bold text-[var(--color-text-muted)] tracking-wider tabular-nums mt-0.5 hidden md:block">
        {formatOrder(order)}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h2>
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
