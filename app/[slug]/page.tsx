import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicPortfolioBySlug } from '@/lib/portfolio'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatDate, profileTypeLabel, templateLabel } from '@/lib/site'
import { ArrowUpRight, Globe, Zap } from '@/lib/icons'

type Params = Promise<{ slug: string }>

export default async function PublicPortfolioPage({ params }: { params: Params }) {
  const { slug } = await params
  const portfolio = await getPublicPortfolioBySlug(slug)

  if (!portfolio || !portfolio.isPublished) {
    notFound()
  }

  const profile = portfolio.user.profile

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(232,103,58,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(124,79,224,0.1),transparent_30%),linear-gradient(180deg,#f8f7f4_0%,#fff_100%)]">
      <header className="border-b border-[#e8e4df]/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f0e0d] to-[#e8673a]">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f0e0d]">{portfolio.user.name}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Public portfolio</p>
            </div>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="sm">
              Create your own
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card padding="lg" className="border-[#ece8e3] bg-[#0f0e0d] text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/50">
              <Globe size={13} className="text-[#e8673a]" />
              Published portfolio
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight lg:text-6xl">{portfolio.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/65">
              {portfolio.description || 'A curated public portfolio with selected projects and a clean professional presence.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="premium">{templateLabel(portfolio.template)}</Badge>
              {profile ? <Badge variant="success">{profileTypeLabel(profile.type)}</Badge> : null}
              <Badge variant="free">/{portfolio.slug}</Badge>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`mailto:${portfolio.user.email}`}>
                <Button variant="accent" size="sm">
                  Contact owner
                  <ArrowUpRight size={14} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Sign in
                </Button>
              </Link>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4 border-[#ece8e3]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Profile</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#0f0e0d]">{portfolio.user.name}</h2>
              </div>
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-[#0f0e0d] to-[#e8673a]" />
            </div>
            <div className="rounded-3xl border border-[#e8e4df] bg-[#faf9f7] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#a8a49f]">Bio</p>
              <p className="mt-2 text-sm leading-6 text-[#6b6760]">
                {profile?.bio || 'No bio provided yet.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-[#e8e4df] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#a8a49f]">Template</p>
                <p className="mt-2 text-sm font-medium text-[#0f0e0d]">{templateLabel(portfolio.template)}</p>
              </div>
              <div className="rounded-3xl border border-[#e8e4df] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#a8a49f]">Published</p>
                <p className="mt-2 text-sm font-medium text-[#0f0e0d]">{formatDate(portfolio.createdAt)}</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Projects</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#0f0e0d]">Featured work</h2>
            </div>
            <p className="text-sm text-[#6b6760]">{portfolio.projects.length} project entries</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {portfolio.projects.length > 0 ? (
              portfolio.projects.map((project) => (
                <Card key={project.id} padding="none" className="overflow-hidden border-[#ece8e3]">
                  <div className="aspect-[4/3] bg-[linear-gradient(135deg,rgba(232,103,58,0.18),rgba(124,79,224,0.16))]" />
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-[#0f0e0d]">{project.title}</h3>
                      {project.link ? (
                        <Link href={project.link} target="_blank" className="rounded-full border border-[#e8e4df] p-2 text-[#6b6760] transition hover:text-[#0f0e0d]">
                          <ArrowUpRight size={14} />
                        </Link>
                      ) : null}
                    </div>
                    <p className="text-sm leading-6 text-[#6b6760]">{project.description || 'No project description yet.'}</p>
                  </div>
                </Card>
              ))
            ) : (
              <Card padding="lg" className="md:col-span-2 xl:col-span-3 text-center">
                <p className="text-sm text-[#6b6760]">This portfolio does not have any projects yet.</p>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
