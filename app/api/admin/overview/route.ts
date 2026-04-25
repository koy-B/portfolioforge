import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/auth'
import { jsonError } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { SubscriptionStatus } from '@prisma/client'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return jsonError('Unauthorized', 401)

  const [totalUsers, totalPortfolios, totalPremiumUsers] = await Promise.all([
    prisma.user.count(),
    prisma.portfolio.count(),
    prisma.subscription.count({
      where: { status: SubscriptionStatus.PREMIUM },
    }),
  ])

  return NextResponse.json({
    totalUsers,
    totalPortfolios,
    totalPremiumUsers,
  })
}
