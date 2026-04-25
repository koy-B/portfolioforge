'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { APP_NAME, formatDate, templateLabel, whatsappPremiumLink } from '@/lib/site'
import {
  ArrowUpRight,
  Eye,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Trash2,
  Sparkles,
} from '@/lib/icons'
import type { Portfolio, Project, Subscription } from '@prisma/client'
import type { SafeUser } from '@/lib/auth'

type PortfolioWithProjects = Portfolio & { projects: Project[] }

interface DashboardClientProps {
  user: SafeUser
  profileName: string
  subscription: Subscription | null
  portfolios: PortfolioWithProjects[]
  stats: {
    portfolioCount: number
    publishedCount: number
    projectCount: number
  }
}

export function DashboardClient({
  user,
  profileName,
  subscription,
  portfolios,
  stats,
}: DashboardClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [busyId, setBusyId] = useState<string | null>(null)

  const isPremium = subscription?.status === 'PREMIUM'
  const premiumHref = whatsappPremiumLink(user.name)

  async function mutatePortfolio(portfolioId: string, action: 'publish' | 'delete') {
    setBusyId(portfolioId)
    try {
      const response =
        action === 'publish'
          ? await fetch(`/api/portfolios/${portfolioId}/publish`, { method: 'PATCH' })
          : await fetch(`/api/portfolios/${portfolioId}`, { method: 'DELETE' })

      if (!response.ok) {
        throw new Error('Action failed')
      }

      toast(action === 'publish' ? 'Portfolio published.' : 'Portfolio deleted.', 'success')
      router.refresh()
    } catch {
      toast('Unable to complete the action.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-brand-background">
      <Sidebar
        name={user.name}
        email={user.email}
        username={profileName}
        premium={isPremium}
      />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 border-b border-brand-border bg-white/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle">{APP_NAME}</p>
              <h1 className="text-lg font-semibold text-brand-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href={premiumHref} target="_blank">
                <Button variant="accent" size="sm">
                  <Sparkles size={14} />
                  Go Premium
                </Button>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-background hover:text-brand-foreground"
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-8 px-6 py-8 lg:px-8">
          <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
            <Card className="relative overflow-hidden border-[#ece8e3] bg-brand-foreground text-white" padding="lg">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,103,58,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(124,79,224,0.18),transparent_35%)]" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Welcome back</p>
                <h2 className="mt-3 text-3xl font-semibold">{user.name}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                  Your profile type is <span className="text-white">{profileName}</span>. Manage your portfolio, publish
                  public pages, and request manual premium activation anytime.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/builder">
                    <Button variant="accent" size="sm">
                      <Plus size={14} />
                      New portfolio
                    </Button>
                  </Link>
                  <Link href={whatsappPremiumLink(user.name)} target="_blank">
                    <Button variant="secondary" size="sm">
                      Request premium
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle">Account</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-brand-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-brand-foreground">Subscription</p>
                    <p className="text-xs text-brand-muted">
                      {isPremium ? 'Premium active' : 'Free plan'}
                    </p>
                  </div>
                  <Badge variant={isPremium ? 'premium' : 'free'}>{subscription?.status ?? 'FREE'}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-brand-border p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-subtle">Started</p>
                    <p className="mt-2 text-sm font-medium text-brand-foreground">
                      {formatDate(subscription?.startDate ?? null)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-brand-border p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-subtle">Expires</p>
                    <p className="mt-2 text-sm font-medium text-brand-foreground">
                      {formatDate(subscription?.endDate ?? null)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Portfolios', value: stats.portfolioCount, icon: FolderOpen },
              { label: 'Published', value: stats.publishedCount, icon: Eye },
              { label: 'Projects', value: stats.projectCount, icon: ArrowUpRight },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} padding="lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle">{label}</p>
                    <p className="mt-3 text-3xl font-semibold text-brand-foreground">{value}</p>
                  </div>
                  <div className="rounded-2xl bg-brand-background p-3 text-brand-foreground">
                    <Icon size={18} />
                  </div>
                </div>
              </Card>
            ))}
          </section>

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle">Your work</p>
                <h3 className="mt-2 text-2xl font-semibold text-brand-foreground">Portfolios</h3>
              </div>
              <Link href="/builder">
                <Button variant="primary" size="sm">
                  <Plus size={14} />
                  Create portfolio
                </Button>
              </Link>
            </div>

            {portfolios.length === 0 ? (
              <Card padding="lg" className="text-center">
                <FolderOpen size={36} className="mx-auto text-[#d7d2cc]" />
                <p className="mt-4 text-lg font-medium text-brand-foreground">No portfolios yet</p>
                <p className="mt-1 text-sm text-brand-muted">Create your first portfolio to publish a public profile page.</p>
                <Link href="/builder" className="mt-5 inline-block">
                  <Button variant="accent" size="sm">
                    Get started
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {portfolios.map((portfolio) => (
                  <Card key={portfolio.id} padding="lg" className="border-brand-border">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-semibold text-brand-foreground">{portfolio.title}</h4>
                          <Badge variant={portfolio.isPublished ? 'success' : 'free'}>
                            {portfolio.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-brand-muted">
                          {portfolio.description || 'No description added yet.'}
                        </p>
                      </div>
                      <button className="rounded-xl p-2 text-brand-subtle transition hover:bg-brand-background hover:text-brand-foreground">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-brand-border p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-brand-subtle">Slug</p>
                        <p className="mt-1 text-sm font-medium text-brand-foreground">/{portfolio.slug}</p>
                      </div>
                      <div className="rounded-2xl border border-brand-border p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-brand-subtle">Template</p>
                        <p className="mt-1 text-sm font-medium text-brand-foreground">{templateLabel(portfolio.template)}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link href={`/${portfolio.slug}`} target="_blank">
                        <Button variant="secondary" size="sm">
                          View public page
                        </Button>
                      </Link>
                      <Link href={`/builder?portfolioId=${portfolio.id}`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                      {portfolio.isPublished ? null : (
                        <Button
                          variant="primary"
                          size="sm"
                          loading={busyId === portfolio.id}
                          onClick={() => mutatePortfolio(portfolio.id, 'publish')}
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        loading={busyId === portfolio.id}
                        onClick={() => mutatePortfolio(portfolio.id, 'delete')}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
