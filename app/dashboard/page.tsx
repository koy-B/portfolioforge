import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { getCurrentUser } from '@/lib/auth'
import { requireUser } from '@/lib/guards'
import { getDashboardSummary } from '@/lib/portfolio'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  await requireUser()
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const [profile, subscription, portfolios, summary] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.portfolio.findMany({
      where: { userId: user.id },
      include: { projects: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    }),
    getDashboardSummary(user.id),
  ])

  return (
    <DashboardClient
      user={user}
      profileName={profile?.type ?? 'developer'}
      subscription={subscription}
      portfolios={portfolios}
      stats={{
        portfolioCount: summary.portfolioCount,
        publishedCount: summary.publishedCount,
        projectCount: summary.projectCount,
      }}
    />
  )
}
