import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getCurrentUser } from '@/lib/auth'
import { requireUser } from '@/lib/guards'
import { prisma } from '@/lib/prisma'
import { whatsappPremiumLink, formatDate } from '@/lib/site'
import { Badge } from '@/components/ui/Badge'
import { ArrowRight, Sparkles } from '@/lib/icons'

export default async function SettingsPage() {
  await requireUser()
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const [profile, subscription] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
  ])

  const premiumHref = whatsappPremiumLink(user.name)
  const isPremium = subscription?.status === 'PREMIUM'

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(232,103,58,0.08),transparent_24%),linear-gradient(180deg,#f8f7f4_0%,#fff_100%)] px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <Card padding="lg">
          <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Settings</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#0f0e0d]">Account settings</h1>
          <p className="mt-2 text-sm leading-6 text-[#6b6760]">
            Manage your profile details, subscription status, and premium access request.
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card padding="lg" className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Profile</p>
            <h2 className="text-xl font-semibold text-[#0f0e0d]">{user.name}</h2>
            <p className="text-sm text-[#6b6760]">{user.email}</p>
            <p className="text-sm text-[#6b6760]">Type: {profile?.type ?? 'developer'}</p>
            <p className="text-sm text-[#6b6760]">Bio: {profile?.bio || 'No bio provided.'}</p>
          </Card>

          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#a8a49f]">Subscription</p>
                <h2 className="mt-2 text-xl font-semibold text-[#0f0e0d]">{subscription?.status ?? 'FREE'}</h2>
              </div>
              <Badge variant={isPremium ? 'premium' : 'free'}>{subscription?.status ?? 'FREE'}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#e8e4df] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#a8a49f]">Start</p>
                <p className="mt-2 text-sm font-medium text-[#0f0e0d]">{formatDate(subscription?.startDate ?? null)}</p>
              </div>
              <div className="rounded-2xl border border-[#e8e4df] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#a8a49f]">End</p>
                <p className="mt-2 text-sm font-medium text-[#0f0e0d]">{formatDate(subscription?.endDate ?? null)}</p>
              </div>
            </div>
            {!isPremium ? (
              <Link href={premiumHref} target="_blank">
                <Button variant="accent" size="sm">
                  <Sparkles size={14} />
                  Request premium
                  <ArrowRight size={14} />
                </Button>
              </Link>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  )
}
