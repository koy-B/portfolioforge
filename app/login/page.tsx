import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { APP_NAME } from '@/lib/site'
import { ArrowRight, CheckCircle, Sparkles, Zap } from '@/lib/icons'

const bullets = [
  'Protected dashboards',
  'Portfolio CRUD + publishing',
  'Manual premium activation',
  'Public pages on /username',
]

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr] bg-brand-background">
      <section className="flex flex-col items-center justify-center p-6 sm:p-12 md:p-20">
        <div className="w-full max-w-[420px] animate-fade-up">
          <Link href="/" className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-foreground to-brand-accent shadow-brand-md">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-brand-foreground" style={{ fontFamily: 'var(--font-syne)' }}>{APP_NAME}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle font-medium">Workspace access</p>
            </div>
          </Link>

          <Card padding="lg" className="border-brand-border/60 shadow-brand-lg">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-brand-accent" />
                <p className="text-xs uppercase tracking-[0.24em] text-brand-subtle font-semibold">Welcome back</p>
              </div>
              <h1 className="text-3xl font-bold text-brand-foreground leading-tight" style={{ fontFamily: 'var(--font-syne)' }}>
                Sign in to your workspace
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                Continue to your dashboard, portfolio builder, and admin tools.
              </p>
            </div>
            
            <AuthForm mode="login" />
            
            <div className="mt-8 pt-6 border-t border-brand-background text-center">
              <p className="text-sm text-brand-muted">
                No account yet?{' '}
                <Link href="/register" className="font-bold text-brand-foreground hover:underline underline-offset-4 transition-all">
                  Create an account
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </section>

      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand-foreground p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,79,224,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(232,103,58,0.2),transparent_40%)] opacity-60" />
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/60 font-semibold mb-10">
            <Sparkles size={12} className="text-brand-accent" />
            Production dashboard
          </div>
          <h2 className="text-5xl font-bold leading-[1.1] mb-6" style={{ fontFamily: 'var(--font-syne)' }}>
            Build a portfolio system that feels like a product.
          </h2>
          <p className="text-lg leading-relaxed text-white/60 max-w-md font-medium">
            Manage accounts, portfolios, projects, and premium access in one dedicated SaaS workspace.
          </p>
        </div>

        <Card className="relative border-white/10 bg-white/5 backdrop-blur-md text-white overflow-hidden" padding="lg">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap size={80} />
          </div>
          <p className="text-lg font-medium leading-relaxed text-white/90 mb-8 italic">
            &quot;The platform combines strong design with real workflow controls for users and admins.&quot;
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 font-medium">
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                {bullet}
              </div>
            ))}
          </div>
          <Link href="/register">
            <Button variant="accent" size="lg" className="w-full">
              Get started for free
              <ArrowRight size={18} />
            </Button>
          </Link>
        </Card>
      </aside>
    </div>
  )
}
