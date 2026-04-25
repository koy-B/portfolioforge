import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/auth'
import { jsonError } from '@/lib/api'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return jsonError('Unauthorized', 401)

  const subscriptions = await prisma.subscription.findMany({
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
    orderBy: {
      user: {
        createdAt: 'desc',
      },
    },
  })

  return NextResponse.json({ subscriptions })
}
