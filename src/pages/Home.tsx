import { useEffect, useRef, useState, useMemo } from 'react'
import { topics } from '../data/topics'
import { TopicSection } from '../components/TopicSection'
import { FileCard } from '../components/FileCard'
import { Search, X, Check } from 'lucide-react'
import { useCompletion } from '../hooks/useCompletion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeId, setActiveId] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'notes' | 'questions' | 'review'>('all')
  const { completed, toggle, isCompleted } = useCompletion()

  // ⌘K / Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
      if (e.key === 'Escape') {
        setSearchQuery('')
        searchRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Scroll-spy: highlight active topic in sidebar
  useEffect(() => {
    const sectionEls = topics.map(t => document.getElementById(t.id)).filter(Boolean)
    const reviewEl = document.getElementById('final-review')
    const allEls = [...sectionEls, reviewEl].filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }, { rootMargin: '-20% 0px -70% 0px' })

    allEls.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const filteredTopics = useMemo(() => {
    return topics.map(topic => {
      const baseFiles = searchQuery.trim()
        ? (() => {
            const query = searchQuery.toLowerCase()
            const filterFiles = (files: any[]) => files.filter(f => f.title.toLowerCase().includes(query))
            if (topic.title.toLowerCase().includes(query)) return topic.files
            return {
              notes: filterFiles(topic.files.notes),
              questions: filterFiles(topic.files.questions),
              reviewQuestions: filterFiles(topic.files.reviewQuestions),
              solutions: filterFiles(topic.files.solutions),
            }
          })()
        : topic.files

      const files = {
        notes: categoryFilter === 'all' || categoryFilter === 'notes' ? baseFiles.notes : [],
        questions: categoryFilter === 'all' || categoryFilter === 'questions' ? baseFiles.questions : [],
        reviewQuestions: categoryFilter === 'all' || categoryFilter === 'review' ? baseFiles.reviewQuestions : [],
        solutions: baseFiles.solutions,
      }
      return { ...topic, files }
    }).filter(topic =>
      topic.files.notes.length > 0 ||
      topic.files.questions.length > 0 ||
      topic.files.reviewQuestions.length > 0
    )
  }, [searchQuery, categoryFilter])

  // Hero animation — runs once on mount
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.1 }
      )
    }
  }, [])

  // Scroll animations — fast, non-blocking reveals
  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.kill())

    if (searchQuery) return

    const headers = document.querySelectorAll('.topic-section h2')
    headers.forEach((header) => {
      gsap.fromTo(header,
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.05, ease: "power2.out",
          scrollTrigger: { trigger: header, start: "top 100%", once: true }
        }
      )
    })

    const cards = document.querySelectorAll('.topic-section .file-card')
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.1, ease: "power2.out", delay: (i % 4) * 0.04,
          scrollTrigger: { trigger: card, start: "top 105%", once: true }
        }
      )
    })
  }, [filteredTopics, searchQuery])

  const fileCount = (topic: typeof topics[0]) =>
    topic.files.notes.length + topic.files.questions.length + topic.files.reviewQuestions.length

  const reviewFiles = useMemo(() =>
    topics.flatMap(t => t.files.reviewQuestions)
      .filter(f => !searchQuery || f.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  )

  return (
    <div className="relative">

      {/* Fixed Sidebar — stays pinned to right side of viewport on desktop */}
      <aside
        className="hidden lg:flex flex-col w-56 fixed overflow-y-auto z-10"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          maxHeight: 'calc(100vh - 8rem)',
          right: 'max(2rem, calc((100vw - 1400px) / 2 + 2rem))',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="mb-4 border-b border-[var(--color-border)] pb-3">
          <h3 className="text-[15px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Index
          </h3>
        </div>
        <nav className="flex flex-col gap-0">
          {topics.map(topic => {
            const isActive = activeId === topic.id
            const done = isCompleted(topic.id)
            const count = fileCount(topic)
            return (
              <a
                key={topic.id}
                href={`#${topic.id}`}
                className={`flex items-center justify-between px-2 py-1 text-[11px] rounded transition-all font-medium ${
                  isActive ? 'text-white bg-white/5' : done ? 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.03]' : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <span className={`truncate ${done ? 'line-through decoration-[var(--color-text-muted)]' : ''}`}>{topic.title}</span>
                {done
                  ? <Check size={10} className="ml-2 shrink-0 text-white/50" />
                  : <span className="text-[9px] tabular-nums ml-2 shrink-0 text-[var(--color-text-muted)]">{count}</span>
                }
              </a>
            )
          })}
          <a
            href="#final-review"
            className={`flex items-center justify-between px-2 py-1 text-[11px] rounded transition-all font-bold mt-3 pt-3 border-t border-[var(--color-border)] ${activeId === 'final-review'
              ? 'text-white'
              : 'text-[var(--color-text-secondary)] hover:text-white'
              }`}
          >
            <span>Final Exam Reviews</span>
            <span className="text-[9px] tabular-nums ml-2 shrink-0 text-[var(--color-text-muted)]">
              {topics.flatMap(t => t.files.reviewQuestions).length}
            </span>
          </a>
        </nav>
      </aside>

      {/* Main Content — right-padded only when sidebar is visible */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-28 pb-24 lg:pr-72 xl:pr-80">

        {/* Hero Section */}
        <section ref={heroRef} className="mb-24 mt-12">
          <div className="inline-block px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[var(--color-border)] rounded-full text-[var(--color-text-muted)] mb-8 font-bold bg-[var(--color-bg-secondary)]">
            Semester Archive · {topics.length} Topics
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold tracking-tighter mb-8 leading-[1.05] text-white">
            Foundations II <br /> <span className="text-[var(--color-text-secondary)]">Review Library.</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-10 leading-relaxed font-light">
            A meticulously structured archive of course notes, practice questions, and solutions designed to streamline your final exam preparation.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6 flex-wrap">
            {[
              { label: 'Topics', value: topics.length },
              { label: 'Notes', value: topics.flatMap(t => t.files.notes).length },
              { label: 'Homeworks', value: topics.flatMap(t => t.files.questions).length },
              { label: 'Review Sessions', value: topics.flatMap(t => t.files.reviewQuestions).length },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-semibold text-white tabular-nums">{stat.value}</div>
                <div className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Completion progress */}
          <div className="mb-10 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[var(--color-text-muted)]">
                Progress
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[var(--color-text-muted)] tabular-nums">
                {completed.size} / {topics.length}
                {completed.size === topics.length && completed.size > 0 && (
                  <span className="ml-2 text-white">· All done! 🎉</span>
                )}
              </span>
            </div>
            <div className="h-[2px] bg-[var(--color-border)] w-full">
              <div
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${topics.length > 0 ? (completed.size / topics.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-[var(--color-text-muted)] group-focus-within:text-white transition-colors" />
            </div>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search topics or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-24 py-4 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-white placeholder-[var(--color-text-muted)] font-medium"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
              {searchQuery ? (
                <button
                  onClick={() => { setSearchQuery(''); searchRef.current?.focus() }}
                  className="text-[var(--color-text-muted)] hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded font-mono">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>
          {searchQuery && (
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              {filteredTopics.length === 0 ? 'No results' : `${filteredTopics.length} topic${filteredTopics.length === 1 ? '' : 's'} matched`}
            </p>
          )}

          {/* Category filter pills */}
          <div className="flex items-center gap-2 mt-6">
            {(['all', 'notes', 'questions', 'review'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                  categoryFilter === cat
                    ? 'border-white text-white bg-white/10'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {cat === 'all' ? 'All' : cat === 'notes' ? 'Notes' : cat === 'questions' ? 'Practice' : 'Review'}
              </button>
            ))}
          </div>
        </section>

        {filteredTopics.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[var(--color-border)] rounded-2xl">
            <p className="text-[var(--color-text-secondary)] text-base mb-2">No materials found for "{searchQuery}".</p>
            <button onClick={() => setSearchQuery('')} className="text-xs text-[var(--color-text-muted)] underline underline-offset-2 hover:text-white transition-colors">
              Clear search
            </button>
          </div>
        ) : (
          <div id="topics" className="space-y-4">
            {filteredTopics.map((topic, index) => (
              <TopicSection
                key={topic.id}
                id={topic.id}
                title={topic.title}
                files={topic.files}
                order={index + 1}
                isCompleted={isCompleted(topic.id)}
                onToggle={() => toggle(topic.id)}
              />
            ))}
          </div>
        )}

        {(!searchQuery || reviewFiles.length > 0) && (
          <section id="final-review" className="scroll-mt-32 mt-40 pt-20 border-t border-[var(--color-border)] topic-section">
            <div className="mb-16">
              <h2 className="text-4xl font-semibold tracking-tighter mb-4 text-white">Review Sessions</h2>
              <p className="text-[var(--color-text-secondary)] max-w-xl font-light leading-relaxed">Dedicated review materials and sessions for midterm and final preparations, grouped for rapid access.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviewFiles.map((file, i) => (
                <FileCard key={`fr-${i}`} title={file.title} path={file.path} solutionPath={file.solutionPath} type="review" />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
