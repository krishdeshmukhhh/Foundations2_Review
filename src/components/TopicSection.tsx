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
    <section id={id} className="scroll-mt-32 mb-32 relative topic-section">
      <div className="absolute -left-8 md:-left-16 top-0 text-[var(--color-border)] text-7xl md:text-8xl font-bold opacity-40 select-none hidden sm:block tracking-tighter pointer-events-none">
        {formatOrder(order)}
      </div>
      <div className="mb-12 relative z-10 sm:pl-4">
        <h2 className="text-3xl font-medium tracking-tight text-[var(--color-text-primary)]">{title}</h2>
        <div className="h-[1px] w-full bg-gradient-to-r from-[var(--color-border)] to-transparent mt-6"></div>
      </div>

      <div className="space-y-12 relative z-10 sm:pl-4">
        {hasNotes && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-6">
              Course Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {files.notes.map((file, i) => (
                <FileCard key={i} title={file.title} path={file.path} type="notes" />
              ))}
            </div>
          </div>
        )}

        {hasQuestions && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-6">
              Practice Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {files.questions.map((file, i) => (
                <FileCard 
                  key={i} 
                  title={file.title} 
                  path={file.path} 
                  solutionPath={file.solutionPath}
                  type="questions"
                />
              ))}
            </div>
          </div>
        )}

        {hasReview && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-6">
              Final Review
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {files.reviewQuestions.map((file, i) => (
                <FileCard 
                  key={i} 
                  title={file.title} 
                  path={file.path} 
                  solutionPath={file.solutionPath}
                  type="review" 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
