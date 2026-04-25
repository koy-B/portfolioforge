'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowRight, Eye } from '@/lib/icons'

const categories = ['All', 'Designer', 'Engineer', 'Writer', 'Photographer', 'Creative']

const templates = [
  { name: 'Luminary', category: 'Designer', from: '#e8673a', to: '#f0a060', desc: 'Warm and expressive. Perfect for visual designers.' },
  { name: 'Architect', category: 'Engineer', from: '#7c4fe0', to: '#a67cff', desc: 'Clean and technical. Built for developers and engineers.' },
  { name: 'Chronicle', category: 'Writer', from: '#0f0e0d', to: '#3a3836', desc: 'Minimal and text-focused. Ideal for writers and journalists.' },
  { name: 'Prism', category: 'Creative', from: '#0ea5e9', to: '#7c4fe0', desc: 'Bold and colorful. Made for creative directors.' },
  { name: 'Serif', category: 'Writer', from: '#6b6760', to: '#a8a49f', desc: 'Elegant and editorial. Great for content creators.' },
  { name: 'Studio', category: 'Photographer', from: '#1a1916', to: '#4a4744', desc: 'Dark and dramatic. Built for photographers.' },
  { name: 'Gradient', category: 'Designer', from: '#e8673a', to: '#7c4fe0', desc: 'Vibrant and modern. For bold self-promotion.' },
  { name: 'Minimal', category: 'Engineer', from: '#f8f7f4', to: '#e8e4df', desc: 'Ultra-clean. Let your work do the talking.' },
  { name: 'Canvas', category: 'Creative', from: '#fbbf24', to: '#e8673a', desc: 'Playful and artistic. For illustrators and artists.' },
]

export default function TemplatesPage() {
  const [selected, setSelected] = useState('All')
  const [hovered, setHovered] = useState<string | null>(null)

  const filtered = selected === 'All' ? templates : templates.filter((template) => template.category === selected)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(232,103,58,0.08),transparent_28%),linear-gradient(180deg,#f8f7f4_0%,#fff_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e8673a]">Templates</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-[#0f0e0d]">
            Start with a template that fits your style
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[#6b6760]">
            Every template is fully customizable &mdash; colors, fonts, and layout. Make it yours in minutes.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelected(category)}
              className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
                selected === category
                  ? 'bg-[#0f0e0d] text-white'
                  : 'border border-[#e8e4df] bg-white text-[#6b6760] hover:bg-[#f8f7f4] hover:text-[#0f0e0d]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <Card
              key={template.name}
              padding="none"
              className="group overflow-hidden border-[#ece8e3]"
              onMouseEnter={() => setHovered(template.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="relative aspect-[4/3] overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${template.from}20, ${template.to}20)` }}
              >
                <div className="absolute inset-4 flex flex-col">
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${template.from}, ${template.to})` }}
                  >
                    {template.name[0]}
                  </div>
                  <div className="mb-2 h-4 w-28 rounded bg-black/10" />
                  <div className="mb-6 h-2.5 w-20 rounded bg-black/5" />
                  <div className="grid flex-1 grid-cols-2 gap-2">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="rounded-xl bg-white/70" />
                    ))}
                  </div>
                </div>

                <div
                  className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/20 backdrop-blur-sm transition ${
                    hovered === template.name ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Link href="/register">
                    <Button variant="secondary" size="sm">
                      Use template
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                    <Eye size={14} />
                    Preview
                  </Button>
                </div>
              </div>

              <div className="space-y-2 p-5">
                <p className="text-lg font-semibold text-[#0f0e0d]">{template.name}</p>
                <p className="text-sm text-[#6b6760]">{template.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="mb-4 text-[#6b6760]">Can&apos;t find what you&apos;re looking for?</p>
          <Link href="/register">
            <Button variant="accent" size="lg">
              Start from scratch
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
