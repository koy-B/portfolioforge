import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { APP_NAME } from '@/lib/site'
import {
  ArrowRight,
  CheckCircle,
  Globe,
  LayoutDashboard,
  Palette,
  Shield,
  Sparkles,
  Users,
  Zap,
} from '@/lib/icons'

const features = [
  {
    title: 'Create portfolios fast',
    description: 'Build and publish professional portfolio pages with structured forms and reusable templates.',
    icon: Palette,
  },
  {
    title: 'Public slug pages',
    description: 'Every published portfolio is available at /username for clients, recruiters, and collaborators.',
    icon: Globe,
  },
  {
    title: 'Admin-controlled premium',
    description: 'Premium access is activated manually by admin with a 30-day window and clear subscription state.',
    icon: Shield,
  },
  {
    title: 'Protected dashboard',
    description: 'Middleware and session cookies keep the builder, dashboard, and admin panel behind auth.',
    icon: LayoutDashboard,
  },
  {
    title: 'User and subscription management',
    description: 'Admins can promote users and activate or deactivate premium access from the console.',
    icon: Users,
  },
  {
    title: 'Modern UI system',
    description: 'The interface uses a deliberate visual system with strong contrast, gradients, and density.',
    icon: Sparkles,
  },
]

const steps = [
  'Register or log in to unlock the workspace.',
  'Create a portfolio, add projects, and choose a template.',
  'Publish the page and share /username publicly.',
  'Request premium access through WhatsApp for manual activation.',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(232,103,58,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(124,79,224,0.08),transparent_24%),linear-gradient(180deg,#f8f7f4_0%,#ffffff_100%)]">
      <header className="sticky top-0 z-30 border-b border-[#e8e4df]/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f0e0d] to-[#e8673a]">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f0e0d]">{APP_NAME}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Portfolio SaaS</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-[#6b6760] transition hover:text-[#0f0e0d]">
              Features
            </a>
            <a href="#workflow" className="text-sm text-[#6b6760] transition hover:text-[#0f0e0d]">
              Workflow
            </a>
            <a href="#premium" className="text-sm text-[#6b6760] transition hover:text-[#0f0e0d]">
              Premium
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="accent" size="sm">
                Get started
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e4df] bg-white px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#6b6760] shadow-sm">
              <CheckCircle size={13} className="text-emerald-500" />
              Production-ready portfolio builder
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-[#0f0e0d] lg:text-7xl">
              Build a portfolio platform that looks premium by default.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b6760]">
              Next.js App Router, Prisma, SQLite, and Tailwind come together in a SaaS experience for users, admins,
              and public portfolio visitors.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button variant="accent" size="lg">
                  Start free
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  Open dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#6b6760]">
              {['Auth protected', 'Admin dashboard', 'Public slug pages', 'Manual premium activation'].map((item) => (
                <span key={item} className="rounded-full border border-[#e8e4df] bg-white px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <Card padding="none" className="overflow-hidden border-[#ece8e3] bg-[#0f0e0d] text-white shadow-2xl shadow-black/10">
            <div className="border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Public page</p>
                <h2 className="mt-3 text-3xl font-semibold">jane-doe</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  A published portfolio with projects, profile type, and clean CTA blocks.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Portfolios</p>
                  <p className="mt-3 text-3xl font-semibold">03</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Projects</p>
                  <p className="mt-3 text-3xl font-semibold">12</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(232,103,58,0.22),rgba(124,79,224,0.18))] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/65">Premium flow</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Users click Go Premium and are redirected to WhatsApp with a pre-filled message.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Capabilities</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#0f0e0d]">Everything needed for a portfolio SaaS</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <Card key={title} hover padding="lg" className="border-[#ece8e3]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(232,103,58,0.12),rgba(124,79,224,0.12))] text-[#e8673a]">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-semibold text-[#0f0e0d]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6b6760]">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <Card padding="lg" className="border-[#ece8e3]">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Workflow</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#0f0e0d]">A simple path from signup to published portfolio</h2>
              </div>
              <div className="grid gap-3">
                {steps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-3xl border border-[#e8e4df] bg-[#faf9f7] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f0e0d] text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-[#6b6760]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section id="premium" className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <Card padding="lg" className="border-[#ece8e3] bg-[#0f0e0d] text-white">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Premium</p>
                <h2 className="mt-2 text-3xl font-semibold">Manual premium activation without Stripe</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Users request premium access, admins activate it by hand, and the subscription period is recorded for
                  30 days.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register">
                  <Button variant="accent" size="lg">
                    Create account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  )
}
