import { useEffect, useRef, useState, useMemo } from 'react'
import { topics } from '../data/topics'
import { TopicSection } from '../components/TopicSection'
import { FileCard } from '../components/FileCard'
import { Search } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics
    
    const query = searchQuery.toLowerCase()
    return topics.map(topic => {
      const filterFiles = (files: any[]) => files.filter(f => f.title.toLowerCase().includes(query))
      return {
        ...topic,
        files: {
          notes: filterFiles(topic.files.notes),
          questions: filterFiles(topic.files.questions),
          reviewQuestions: filterFiles(topic.files.reviewQuestions),
          solutions: filterFiles(topic.files.solutions)
        }
      }
    }).filter(topic => 
      topic.files.notes.length > 0 || 
      topic.files.questions.length > 0 || 
      topic.files.reviewQuestions.length > 0
    )
  }, [searchQuery])

  useEffect(() => {
    // Hero Animation runs only once on mount
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.1 }
      )
    }
  }, [])

  useEffect(() => {
    // Clear previous ScrollTriggers to prevent duplication
    ScrollTrigger.getAll().forEach(t => t.kill())

    // Scroll Animations for sections and cards
    const sections = document.querySelectorAll('.topic-section')
    sections.forEach((section) => {
      const cards = section.querySelectorAll('.file-card')
      const header = section.querySelector('h2')
      const subheaders = section.querySelectorAll('h3')

      // If user is actively searching, just make elements instantly visible to prevent jarring flashes
      if (searchQuery) {
        const targets = []
        if (header) targets.push(header)
        if (subheaders.length) targets.push(subheaders)
        if (cards.length) targets.push(cards)
        
        if (targets.length > 0) {
          gsap.set(targets, { clearProps: "all" })
        }
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        }
      })

      if (header) {
        tl.fromTo(header, 
          { opacity: 0, x: -20 }, 
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 
          0
        )
      }
      
      if (subheaders.length) {
        tl.fromTo(subheaders, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.6, ease: "power2.out" }, 
          0.2
        )
      }

      if (cards.length) {
        tl.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)" },
          0.3
        )
      }
    })
  }, [filteredTopics, searchQuery]) // Re-run scroll triggers when filtered items change
  
  return (
    <div className="max-w-[1400px] mx-auto px-8 pt-32 pb-24 flex flex-col lg:flex-row gap-20 items-start relative">
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 order-2 lg:order-1">
        
        {/* Hero Section */}
        <section ref={heroRef} className="mb-24 mt-12">
          <div className="inline-block px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[var(--color-border)] rounded-full text-[var(--color-text-muted)] mb-8 font-bold bg-[var(--color-bg-secondary)]">
            Semester Archive
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
              <Search size={18} className="text-[var(--color-text-muted)] group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search topics or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-white placeholder-[var(--color-text-muted)] font-medium"
            />
          </div>
        </section>

        {filteredTopics.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[var(--color-text-secondary)] text-lg">No materials found matching "{searchQuery}".</p>
          </div>
        ) : (
          <div id="topics" className="space-y-4">
            {filteredTopics.map((topic, index) => (
              <TopicSection key={topic.id} id={topic.id} title={topic.title} files={topic.files} order={index + 1} />
            ))}
          </div>
        )}
        
        {/* Final Exam Specific Section - Only show if not filtering or if matches */}
        {(!searchQuery || topics.flatMap(t => t.files.reviewQuestions).some(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()))) && (
          <section id="final-review" className="scroll-mt-32 mt-40 pt-20 border-t border-[var(--color-border)] topic-section">
            <div className="mb-16">
              <h2 className="text-4xl font-semibold tracking-tighter mb-4 text-white">Review Sessions</h2>
              <p className="text-[var(--color-text-secondary)] max-w-xl font-light leading-relaxed">Dedicated review materials and sessions for midterm and final preparations, grouped for rapid access.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topics.flatMap(t => t.files.reviewQuestions)
                .filter(f => !searchQuery || f.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((file, i) => (
                <FileCard 
                  key={`fr-${i}`} 
                  title={file.title} 
                  path={file.path} 
                  solutionPath={file.solutionPath}
                  type="review" 
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Sidebar Navigation */}
      <aside className="lg:w-56 flex-shrink-0 lg:sticky lg:top-32 order-1 lg:order-2 hidden md:block">
        <div className="mb-8 border-b border-[var(--color-border)] pb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Index
          </h3>
        </div>
        <nav className="flex flex-col gap-3">
          {topics.map(topic => (
            <a
              key={topic.id}
              href={`#${topic.id}`}
              className="text-xs text-[var(--color-text-secondary)] hover:text-white transition-colors font-medium tracking-wide"
            >
              {topic.title}
            </a>
          ))}
          <a
             href="#final-review"
             className="text-xs text-white transition-colors font-bold tracking-wide mt-6 pt-6 border-t border-[var(--color-border)]"
          >
             Final Exam Reviews
          </a>
        </nav>
      </aside>
    </div>
  )
}
