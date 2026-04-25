import { NextResponse } from 'next/server'
import { SubscriptionStatus } from '@prisma/client'
import { getCurrentAdminUser } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ userId: string }>

export async function PATCH(request: Request, context: { params: Params }) {
  const admin = await getCurrentAdminUser()
  if (!admin) return jsonError('Unauthorized', 401)

  const { userId } = await context.params
  const body = await readJsonBody<{ action?: 'activate' | 'deactivate' }>(request)
  const action = body?.action

  if (!action) {
    return jsonError('Action is required', 422)
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })

  if (!targetUser) {
    return jsonError('User not found', 404)
  }

  const subscription = await prisma.subscription.upsert({
    where: { userId },
    update:
      action === 'activate'
        ? {
            status: SubscriptionStatus.PREMIUM,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        : {
            status: SubscriptionStatus.FREE,
            startDate: null,
            endDate: null,
          },
    create:
      action === 'activate'
        ? {
            userId,
            status: SubscriptionStatus.PREMIUM,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        : {
            userId,
            status: SubscriptionStatus.FREE,
          },
  })

  return NextResponse.json({ subscription })
}
