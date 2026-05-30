'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowRight, Eye } from '@/lib/icons'

const categories = ['All', 'Designer', 'Engineer', 'Writer', 'Photographer', 'Creative']

const templates = [
  {
    name: 'Luminary',
    category: 'Designer',
    from: '#ef6d3b',
    to: '#f4b56a',
    desc: 'Warm, elegant layouts for design professionals who want visual storytelling and strong identity.',
    accent: 'text-[#ac5b31] bg-[#fff1e6]',
  },
  {
    name: 'Architect',
    category: 'Engineer',
    from: '#4f5fd3',
    to: '#68a3ff',
    desc: 'Structured and modern. Perfect for engineers with clean sections and technical credibility.',
    accent: 'text-[#31417d] bg-[#eef3ff]',
  },
  {
    name: 'Chronicle',
    category: 'Writer',
    from: '#111111',
    to: '#57544f',
    desc: 'A refined editorial layout built for story-driven portfolios and long-form narratives.',
    accent: 'text-[#2a2a2a] bg-[#f6f5f3]',
  },
  {
    name: 'Prism',
    category: 'Creative',
    from: '#0ea5e9',
    to: '#7c4fe0',
    desc: 'Bold, expressive color and motion-ready sections for creative directors and visual artists.',
    accent: 'text-[#165f8b] bg-[#e8f4ff]',
  },
  {
    name: 'Serif',
    category: 'Writer',
    from: '#7e6b50',
    to: '#b09b8a',
    desc: 'Editorial charm with a polished, magazine-style structure for content creators.',
    accent: 'text-[#5c4732] bg-[#faf5ef]',
  },
  {
    name: 'Studio',
    category: 'Photographer',
    from: '#1e1b19',
    to: '#3b3a35',
    desc: 'Dark, cinematic frames with crisp galleries designed for photographers and visual storytellers.',
    accent: 'text-[#c7c5bd] bg-[#1d1b18]',
  },
  {
    name: 'Gradient',
    category: 'Designer',
    from: '#f97316',
    to: '#8b5cf6',
    desc: 'Gradient-driven visuals and smooth transitions for designers who want a memorable first impression.',
    accent: 'text-[#572a84] bg-[#f6efff]',
  },
  {
    name: 'Minimal',
    category: 'Engineer',
    from: '#f7f5f1',
    to: '#e7e2dc',
    desc: 'Ultra-clean sections with maximum white space for a sleek and professional presentation.',
    accent: 'text-[#4f4b45] bg-[#fbf7f0]',
  },
  {
    name: 'Canvas',
    category: 'Creative',
    from: '#fbbf24',
    to: '#f97316',
    desc: 'Playful and warm, built for illustrators, artists and creative freelancers.',
    accent: 'text-[#7f4f12] bg-[#fff4df]',
  },
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
            Choose a portfolio look that feels unique
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#6b6760]">
            Each template is crafted with a specific audience in mind, from editorial storytellers to designers and technologists.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelected(category)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                selected === category
                  ? 'border-[#0f0e0d] bg-[#0f0e0d] text-white'
                  : 'border-[#e8e4df] bg-white text-[#6b6760] hover:border-[#0f0e0d] hover:text-[#0f0e0d]'
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
              className="group overflow-hidden border border-[#ece8e3] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              onMouseEnter={() => setHovered(template.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative overflow-hidden rounded-[1.5rem] bg-white">
                <div className="p-6" style={{ background: `linear-gradient(135deg, ${template.from}18, ${template.to}18)` }}>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${template.from}, ${template.to})` }}
                    >
                      {template.name[0]}
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${template.accent}`}>
                      {template.category}
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div>
                      <p className="text-2xl font-semibold text-[#0f0e0d]">{template.name}</p>
                      <p className="mt-3 text-sm leading-7 text-[#5f5b54]">{template.desc}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl bg-white/90 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#8f8a80]">Focus</p>
                        <p className="mt-2 text-sm font-medium text-[#0f0e0d]">Strong hero messaging</p>
                      </div>
                      <div className="rounded-3xl bg-white/90 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#8f8a80]">Best for</p>
                        <p className="mt-2 text-sm font-medium text-[#0f0e0d]">User-first storytelling</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/20 backdrop-blur-sm transition duration-300 ${
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
