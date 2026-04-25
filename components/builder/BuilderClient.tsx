'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { cnSlug, profileTypeLabel, templateLabel, whatsappPremiumLink } from '@/lib/site'
import { portfolioTemplates, profileTypes } from '@/lib/validators'
import { ArrowRight, ExternalLink, FolderOpen, Plus, Save, Trash2, Upload } from '@/lib/icons'
import type { Portfolio, Project, Subscription } from '@prisma/client'
import type { SafeUser } from '@/lib/auth'

type PortfolioWithProjects = Portfolio & { projects: Project[] }

interface BuilderClientProps {
  user: SafeUser
  subscription: Subscription | null
  portfolios: PortfolioWithProjects[]
  profileType: (typeof profileTypes)[number]
  initialPortfolioId?: string | null
}

const emptyPortfolioForm = {
  title: '',
  description: '',
  template: 'MINIMAL',
  slug: '',
  isPublished: false,
}

const emptyProjectForm = {
  title: '',
  description: '',
  imageUrl: '',
  link: '',
}

function toPortfolioForm(portfolio?: PortfolioWithProjects | null) {
  if (!portfolio) {
    return emptyPortfolioForm
  }

  return {
    title: portfolio.title,
    description: portfolio.description ?? '',
    template: portfolio.template,
    slug: portfolio.slug,
    isPublished: portfolio.isPublished,
  }
}

export function BuilderClient({
  user,
  subscription,
  portfolios,
  profileType,
  initialPortfolioId,
}: BuilderClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const initialPortfolio = portfolios.find((portfolio) => portfolio.id === initialPortfolioId) ?? portfolios[0] ?? null
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(initialPortfolio?.id ?? null)
  const [portfolioForm, setPortfolioForm] = useState(() => toPortfolioForm(initialPortfolio))
  const [projectForm, setProjectForm] = useState(emptyProjectForm)
  const [saving, setSaving] = useState(false)
  const [projectSaving, setProjectSaving] = useState(false)
  const premiumHref = whatsappPremiumLink(user.name)

  const selectedPortfolio = useMemo(
    () => portfolios.find((portfolio) => portfolio.id === selectedPortfolioId) ?? portfolios[0] ?? null,
    [portfolios, selectedPortfolioId],
  )

  function selectPortfolio(portfolio: PortfolioWithProjects | null) {
    setSelectedPortfolioId(portfolio?.id ?? null)
    setPortfolioForm(toPortfolioForm(portfolio))
    setProjectForm(emptyProjectForm)
  }

  async function savePortfolio() {
    setSaving(true)
    try {
      const endpoint = selectedPortfolio ? `/api/portfolios/${selectedPortfolio.id}` : '/api/portfolios'
      const method = selectedPortfolio ? 'PATCH' : 'POST'
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...portfolioForm,
          slug: portfolioForm.slug ? cnSlug(portfolioForm.slug) : '',
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to save portfolio')
      }

      toast(selectedPortfolio ? 'Portfolio updated.' : 'Portfolio created.', 'success')
      router.refresh()
    } catch {
      toast('Unable to save portfolio.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function saveProject() {
    if (!selectedPortfolio) return
    setProjectSaving(true)
    try {
      const response = await fetch(`/api/portfolios/${selectedPortfolio.id}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      })

      if (!response.ok) {
        throw new Error('Unable to save project')
      }

      toast('Project added.', 'success')
      router.refresh()
    } catch {
      toast('Unable to add the project.', 'error')
    } finally {
      setProjectSaving(false)
    }
  }

  async function deleteProject(projectId: string) {
    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Unable to delete project')
      }
      toast('Project deleted.', 'success')
      router.refresh()
    } catch {
      toast('Unable to delete the project.', 'error')
    }
  }

  async function publishPortfolio() {
    if (!selectedPortfolio) return
    try {
      const response = await fetch(`/api/portfolios/${selectedPortfolio.id}/publish`, { method: 'PATCH' })
      if (!response.ok) throw new Error('Unable to publish portfolio')
      toast('Portfolio published.', 'success')
      router.refresh()
    } catch {
      toast('Unable to publish portfolio.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(232,103,58,0.06),transparent_28%),linear-gradient(180deg,#f8f7f4_0%,#fdfcfb_100%)] px-4 py-6 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <Card padding="lg" className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Builder</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#0f0e0d]">Portfolio workspace</h1>
            <p className="mt-2 text-sm leading-6 text-[#6b6760]">
              Profile type: <span className="font-medium text-[#0f0e0d]">{profileTypeLabel(profileType)}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Button
              variant="accent"
              size="sm"
              className="w-full justify-start"
              onClick={() => selectPortfolio(null)}
            >
              <Plus size={14} />
              Create new portfolio
            </Button>
            <Link href="/dashboard" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <ArrowRight size={14} />
                Back to dashboard
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Your portfolios</p>
            <div className="space-y-2">
              {portfolios.map((portfolio) => (
                <button
                  key={portfolio.id}
                  type="button"
                  onClick={() => selectPortfolio(portfolio)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedPortfolio?.id === portfolio.id
                      ? 'border-[#0f0e0d] bg-[#0f0e0d] text-white'
                      : 'border-[#e8e4df] bg-white hover:bg-[#faf9f7]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{portfolio.title}</p>
                      <p
                        className={
                          selectedPortfolio?.id === portfolio.id
                            ? 'text-white/55 text-xs'
                            : 'text-xs text-[#a8a49f]'
                        }
                      >
                        /{portfolio.slug}
                      </p>
                    </div>
                    <Badge variant={portfolio.isPublished ? 'success' : 'free'}>
                      {portfolio.isPublished ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#e8e4df] bg-[#faf9f7] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Premium</p>
            <p className="mt-2 text-sm leading-6 text-[#6b6760]">
              {subscription?.status === 'PREMIUM'
                ? 'Manual premium access is active.'
                : 'Request premium access through WhatsApp.'}
            </p>
            <Link href={premiumHref} target="_blank" className="mt-4 block">
              <Button variant="accent" size="sm" className="w-full">
                Request premium
              </Button>
            </Link>
          </div>
        </Card>

        <div className="space-y-4">
          <Card padding="lg" className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">
                  {selectedPortfolio ? 'Edit portfolio' : 'New portfolio'}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#0f0e0d]">
                  {selectedPortfolio ? selectedPortfolio.title : 'Create a portfolio'}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b6760]">
                  Configure the public page, choose a template, and publish it when you are ready.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={selectedPortfolio?.isPublished ? 'success' : 'free'}>
                  {selectedPortfolio?.isPublished ? 'Published' : 'Draft'}
                </Badge>
                {selectedPortfolio ? (
                  <Link href={`/${selectedPortfolio.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <ExternalLink size={14} />
                      Open public page
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Portfolio title"
                value={portfolioForm.title}
                onChange={(event) => setPortfolioForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Marketing portfolio"
              />
              <Input
                label="Slug"
                value={portfolioForm.slug}
                onChange={(event) => setPortfolioForm((current) => ({ ...current, slug: cnSlug(event.target.value) }))}
                placeholder="jane-doe"
              />
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-[#0f0e0d]">Description</label>
                <textarea
                  value={portfolioForm.description}
                  onChange={(event) => setPortfolioForm((current) => ({ ...current, description: event.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-[#e8e4df] bg-white px-4 py-3 text-sm text-[#0f0e0d] placeholder:text-[#a8a49f] transition focus:border-[#0f0e0d] focus:ring-2 focus:ring-[#0f0e0d]/10"
                  placeholder="Tell visitors what this portfolio is about."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#0f0e0d]">Template</label>
                <select
                  value={portfolioForm.template}
                  onChange={(event) => setPortfolioForm((current) => ({ ...current, template: event.target.value }))}
                  className="w-full rounded-xl border border-[#e8e4df] bg-white px-4 py-3 text-sm text-[#0f0e0d] transition focus:border-[#0f0e0d] focus:ring-2 focus:ring-[#0f0e0d]/10"
                >
                  {portfolioTemplates.map((template) => (
                    <option key={template} value={template}>
                      {templateLabel(template)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 rounded-2xl border border-[#e8e4df] bg-[#faf9f7] px-4 py-3 text-sm text-[#0f0e0d]">
                  <input
                    type="checkbox"
                    checked={portfolioForm.isPublished}
                    onChange={(event) =>
                      setPortfolioForm((current) => ({ ...current, isPublished: event.target.checked }))
                    }
                    className="h-4 w-4 rounded border-[#d5d0cb] text-[#0f0e0d]"
                  />
                  Publish on save
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm" onClick={savePortfolio} loading={saving}>
                <Save size={14} />
                {selectedPortfolio ? 'Save changes' : 'Create portfolio'}
              </Button>
              {selectedPortfolio && !selectedPortfolio.isPublished ? (
                <Button variant="secondary" size="sm" onClick={publishPortfolio}>
                  <Upload size={14} />
                  Publish now
                </Button>
              ) : null}
            </div>
          </Card>

          {selectedPortfolio ? (
            <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
              <Card padding="lg" className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Projects</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#0f0e0d]">Manage project entries</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Project title"
                    value={projectForm.title}
                    onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Case study name"
                  />
                  <Input
                    label="Project link"
                    value={projectForm.link}
                    onChange={(event) => setProjectForm((current) => ({ ...current, link: event.target.value }))}
                    placeholder="https://..."
                  />
                  <Input
                    label="Image URL"
                    value={projectForm.imageUrl}
                    onChange={(event) => setProjectForm((current) => ({ ...current, imageUrl: event.target.value }))}
                    placeholder="https://..."
                  />
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-[#0f0e0d]">Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                      rows={4}
                      className="w-full rounded-xl border border-[#e8e4df] bg-white px-4 py-3 text-sm text-[#0f0e0d] placeholder:text-[#a8a49f] transition focus:border-[#0f0e0d] focus:ring-2 focus:ring-[#0f0e0d]/10"
                      placeholder="Describe the project outcome and stack."
                    />
                  </div>
                </div>

                <Button variant="accent" size="sm" onClick={saveProject} loading={projectSaving}>
                  <Plus size={14} />
                  Add project
                </Button>
              </Card>

              <Card padding="lg" className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Public page</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#0f0e0d]">/{selectedPortfolio.slug}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6b6760]">
                    {selectedPortfolio.projects.length} project{selectedPortfolio.projects.length === 1 ? '' : 's'} in
                    this portfolio.
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedPortfolio.projects.map((project) => (
                    <div key={project.id} className="rounded-2xl border border-[#e8e4df] bg-[#faf9f7] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-[#0f0e0d]">{project.title}</p>
                          <p className="mt-1 text-sm text-[#6b6760]">{project.description || 'No description.'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteProject(project.id)}
                          className="rounded-xl p-2 text-[#a8a49f] transition hover:bg-white hover:text-[#0f0e0d]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedPortfolio.projects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#e8e4df] p-6 text-center">
                      <FolderOpen size={24} className="mx-auto text-[#d7d2cc]" />
                      <p className="mt-3 text-sm text-[#6b6760]">Add your first project to bring this portfolio to life.</p>
                    </div>
                  ) : null}
                </div>
              </Card>
            </div>
          ) : (
            <Card padding="lg" className="text-center">
              <FolderOpen size={32} className="mx-auto text-[#d7d2cc]" />
              <p className="mt-4 text-lg font-medium text-[#0f0e0d]">Create a portfolio first</p>
              <p className="mt-2 text-sm text-[#6b6760]">Once saved, you can add projects and publish it publicly.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
