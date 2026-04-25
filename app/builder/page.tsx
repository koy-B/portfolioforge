import { BuilderClient } from '@/components/builder/BuilderClient'
import { getCurrentUser } from '@/lib/auth'
import { requireUser } from '@/lib/guards'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ portfolioId?: string }>
}) {
  await requireUser()
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const [subscription, portfolios, profile] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.portfolio.findMany({
      where: { userId: user.id },
      include: { projects: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.profile.findUnique({ where: { userId: user.id } }),
  ])

  return (
    <BuilderClient
      user={user}
      subscription={subscription}
      portfolios={portfolios}
      profileType={profile?.type ?? 'developer'}
      initialPortfolioId={params.portfolioId ?? null}
    />
  )
}
