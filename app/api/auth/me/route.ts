import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const [profile, subscription, portfolios] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.portfolio.findMany({
      where: { userId: user.id },
      include: { projects: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return NextResponse.json({
    user,
    profile,
    subscription,
    portfolios,
  })
}
