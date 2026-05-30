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

  const [totalUsers, totalPortfolios, totalPremiumUsers, totalPendingRequests, users, requests, logs] =
    await Promise.all([
      prisma.user.count(),
      prisma.portfolio.count(),
      prisma.subscription.count({
        where: { status: SubscriptionStatus.PREMIUM },
      }),
      prisma.premiumRequest.count({
        where: { status: 'PENDING' },
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
      prisma.premiumRequest.findMany({
        where: { status: 'PENDING' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.adminLog.findMany({
        include: {
          admin: {
            select: { id: true, name: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
    ])

  const stats = {
    totalUsers,
    totalPortfolios,
    totalPremiumUsers,
    totalPendingRequests,
  }

  const serializedRequests = requests.map((request) => ({
    ...request,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    handledAt: request.handledAt ? request.handledAt.toISOString() : null,
  }))

  const serializedLogs = logs.map((log) => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
  }))

  return (
    <AdminDashboardClient
      admin={admin}
      stats={stats}
      users={users}
      requests={serializedRequests}
      logs={serializedLogs}
    />
  )
}
