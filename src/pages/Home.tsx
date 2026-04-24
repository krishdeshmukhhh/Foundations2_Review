import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { topics } from '../data/topics'
import { TopicSection } from '../components/TopicSection'
import { FileCard } from '../components/FileCard'
import { Search, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeId, setActiveId] = useState<string>('')

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
    if (!searchQuery.trim()) return topics

    const query = searchQuery.toLowerCase()
    return topics.map(topic => {
      const filterFiles = (files: any[]) => files.filter(f => f.title.toLowerCase().includes(query))
      const filtered = {
        ...topic,
        files: {
          notes: filterFiles(topic.files.notes),
          questions: filterFiles(topic.files.questions),
          reviewQuestions: filterFiles(topic.files.reviewQuestions),
          solutions: filterFiles(topic.files.solutions)
        }
      }
      // Also match on topic title
      if (topic.title.toLowerCase().includes(query)) {
        return { ...topic }
      }
      return filtered
    }).filter(topic =>
      topic.files.notes.length > 0 ||
      topic.files.questions.length > 0 ||
      topic.files.reviewQuestions.length > 0
    )
  }, [searchQuery])

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
    <div className="max-w-[1400px] mx-auto px-8 pt-32 pb-24 flex flex-col lg:flex-row gap-20 items-start relative">

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 order-2 lg:order-1">

        {/* Hero Section */}
        <section ref={heroRef} className="mb-24 mt-12">
          <div className="inline-block px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[var(--color-border)] rounded-full text-[var(--color-text-muted)] mb-8 font-bold bg-[var(--color-bg-secondary)]">
            Semester Archive · {topics.length} Topics
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold tracking-tighter mb-8 leading-[1.05] text-white">
            Foundations II <br /> <span className="text-[var(--color-text-secondary)]">Review Library.</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-12 leading-relaxed font-light">
            A meticulously structured archive of course notes, practice questions, and solutions designed to streamline your final exam preparation.
          </p>

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
              <TopicSection key={topic.id} id={topic.id} title={topic.title} files={topic.files} order={index + 1} />
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

      {/* Sidebar Navigation */}
      <aside className="lg:w-56 flex-shrink-0 lg:sticky lg:top-32 order-1 lg:order-2 hidden lg:block">
        <div className="mb-8 border-b border-[var(--color-border)] pb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Index
          </h3>
        </div>
        <nav className="flex flex-col gap-1">
          {topics.map(topic => {
            const isActive = activeId === topic.id
            const count = fileCount(topic)
            return (
              <a
                key={topic.id}
                href={`#${topic.id}`}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all font-medium tracking-wide group ${isActive
                  ? 'bg-white/5 text-white border border-[var(--color-border-hover)]'
                  : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/[0.03]'
                  }`}
              >
                <span>{topic.title}</span>
                <span className={`text-[10px] tabular-nums ${isActive ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-muted)]'}`}>
                  {count}
                </span>
              </a>
            )
          })}
          <a
            href="#final-review"
            className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all font-bold tracking-wide mt-4 border-t border-[var(--color-border)] pt-5 ${activeId === 'final-review'
              ? 'text-white'
              : 'text-[var(--color-text-secondary)] hover:text-white'
              }`}
          >
            <span>Final Exam Reviews</span>
            <span className="text-[10px] tabular-nums text-[var(--color-text-muted)]">
              {topics.flatMap(t => t.files.reviewQuestions).length}
            </span>
          </a>
        </nav>
      </aside>
    </div>
  )
}
