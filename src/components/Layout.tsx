import { Navbar } from './Navbar'
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-12 border-t border-[var(--color-border)] mt-24 relative z-20 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold text-center md:text-left">
            <p>© {new Date().getFullYear()} Foundations II Archive. Created by Krish Deshmukh.</p>
          </div>

          <div className="flex items-center gap-6 text-[var(--color-text-secondary)]">
            <a href="https://github.com/krishdeshmukhhh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="GitHub">
              <FaGithub size={18} />
            </a>
            <a href="https://linkedin.com/in/krish-deshmukh" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] transition-colors" title="LinkedIn">
              <FaLinkedin size={18} />
            </a>
            <a href="https://x.com/DeshmukhKrish" target="_blank" rel="noopener noreferrer" className="hover:text-[#1DA1F2] transition-colors" title="Twitter">
              <FaTwitter size={18} />
            </a>
            <a href="https://instagram.com/krishdevlog" target="_blank" rel="noopener noreferrer" className="hover:text-[#E1306C] transition-colors" title="Instagram">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
