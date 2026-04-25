import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { APP_NAME } from '@/lib/site'
import { CheckCircle, Sparkles, Zap } from '@/lib/icons'

const bullets = [
  'Start free with SQLite and Prisma',
  'Manual premium activation by admin',
  'Protected dashboards and middleware',
  'Public portfolio pages by slug',
]

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[0.95fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-[#0f0e0d] px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,79,224,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(232,103,58,0.18),transparent_28%)]" />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8673a] to-[#7c4fe0]">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">{APP_NAME}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">Create account</p>
            </div>
          </Link>

          <h2 className="mt-8 max-w-xl text-5xl font-semibold leading-tight">
            Launch a professional portfolio in a few minutes.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/60">
            Build portfolios, add projects, and publish a public page with a clean admin workflow behind it.
          </p>
        </div>

        <Card className="relative border-white/10 bg-white/5 text-white" padding="lg">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">Why teams use it</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/10 px-3 py-3 text-sm text-white/70">
                <CheckCircle size={14} className="text-emerald-400" />
                {bullet}
              </div>
            ))}
          </div>
          <Link href="/login" className="mt-6 inline-flex">
            <Button variant="secondary" size="sm">
              I already have an account
            </Button>
          </Link>
        </Card>
      </aside>

      <section className="flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(232,103,58,0.08),transparent_26%),linear-gradient(180deg,#fff_0%,#f8f7f4_100%)] px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#e8673a]" />
              <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Register</p>
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-[#0f0e0d]">Create your account</h1>
            <p className="mt-2 text-sm leading-6 text-[#6b6760]">
              Start with a free account and activate premium later through the admin workflow.
            </p>
          </div>

          <Card padding="lg" className="shadow-2xl shadow-black/5">
            <AuthForm mode="register" />
            <p className="mt-6 text-center text-sm text-[#6b6760]">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-[#0f0e0d] underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
