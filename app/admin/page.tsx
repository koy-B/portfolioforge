import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'
import { getCurrentUser } from '@/lib/auth'
import { requireAdmin } from '@/lib/guards'
import { prisma } from '@/lib/prisma'
import { SubscriptionStatus } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  await requireAdmin()
  const admin = await getCurrentUser()

  if (!admin) {
    redirect('/login')
  }

  const [totalUsers, totalPortfolios, totalPremiumUsers, users, subscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.portfolio.count(),
    prisma.subscription.count({
      where: { status: SubscriptionStatus.PREMIUM },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        subscription: true,
        portfolios: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    }),
  ])

  const stats = {
    totalUsers,
    totalPortfolios,
    totalPremiumUsers,
  }

  return <AdminDashboardClient admin={admin} stats={stats} users={users} subscriptions={subscriptions} />
}
