'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Menu, X, Zap } from '@/lib/icons'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Templates', href: '/templates' },
  { label: 'Pricing', href: '/pricing' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const path = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      scrolled
        ? 'bg-white/90 backdrop-blur-xl border-b border-[#e8e4df] shadow-sm'
        : 'bg-[#f8f7f4]/80 backdrop-blur-xl border-b border-[#e8e4df]'
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e8673a] to-[#7c4fe0] flex items-center justify-center group-hover:opacity-90 transition-opacity">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-[#0f0e0d] text-lg tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            PortfolioForge
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                'text-sm transition-colors',
                path === href ? 'text-[#0f0e0d] font-medium' : 'text-[#6b6760] hover:text-[#0f0e0d]'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">Get started free</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-[#f0ede8] transition-colors text-[#0f0e0d]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#e8e4df] bg-white px-6 py-5 flex flex-col gap-4 animate-fade-in">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm font-medium text-[#6b6760] hover:text-[#0f0e0d] px-2 py-2 rounded-lg hover:bg-[#f8f7f4] transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 pt-3 border-t border-[#f0ede8]">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="secondary" className="w-full">Sign in</Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button variant="primary" className="w-full">Get started free</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
