import { Navbar } from './Navbar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-12 border-t border-[var(--color-border)] mt-24">
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">
          <p>© {new Date().getFullYear()} Foundations II Archive</p>
          <p>Structured for success.</p>
        </div>
      </footer>
    </div>
  )
}
