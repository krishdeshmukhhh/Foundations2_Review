import { useEffect, useRef } from 'react'
import { topics } from '../data/topics'
import { TopicSection } from '../components/TopicSection'
import { FileCard } from '../components/FileCard'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Hero Animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2 }
      )
    }

    // Scroll Animations for sections
    const sections = document.querySelectorAll('.topic-section')
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          }
        }
      )
    })
  }, [])
  
  return (
    <div className="max-w-[1400px] mx-auto px-8 pt-32 pb-24 flex flex-col lg:flex-row gap-20 items-start relative">
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 order-2 lg:order-1">
        
        {/* Hero Section */}
        <section ref={heroRef} className="mb-32 mt-12">
          <div className="inline-block px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[var(--color-border)] rounded-full text-[var(--color-text-muted)] mb-8 font-bold bg-[var(--color-bg-secondary)]">
            Semester Archive
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold tracking-tighter mb-8 leading-[1.05] text-white">
            Foundations II <br /> <span className="text-[var(--color-text-secondary)]">Review Library.</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-12 leading-relaxed font-light">
            A meticulously structured archive of course notes, practice questions, and solutions designed to streamline your final exam preparation.
          </p>
          <div className="h-[1px] w-full max-w-md bg-gradient-to-r from-[var(--color-border)] to-transparent"></div>
        </section>

        {/* Topics Content */}
        <div id="topics" className="space-y-4">
          {topics.map((topic, index) => (
            <TopicSection key={topic.id} id={topic.id} title={topic.title} files={topic.files} order={index + 1} />
          ))}
        </div>
        
        {/* Final Exam Specific Section */}
        <section id="final-review" className="scroll-mt-32 mt-40 pt-20 border-t border-[var(--color-border)] topic-section">
          <div className="mb-16">
            <h2 className="text-4xl font-semibold tracking-tighter mb-4 text-white">Review Sessions</h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl font-light leading-relaxed">Dedicated review materials and sessions for midterm and final preparations, grouped for rapid access.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.flatMap(t => t.files.reviewQuestions).map((file, i) => (
              <FileCard key={`fr-${i}`} title={file.title} path={file.path} type="review" />
            ))}
          </div>
        </section>

      </div>

      {/* Sidebar Navigation */}
      <aside className="lg:w-56 flex-shrink-0 lg:sticky lg:top-32 order-1 lg:order-2">
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
