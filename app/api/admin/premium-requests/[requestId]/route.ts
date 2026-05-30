import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { premiumRequestActionSchema } from '@/lib/validators'

type Params = Promise<{ requestId: string }>

export async function PATCH(request: Request, context: { params: Params }) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return jsonError('Unauthorized', 401)
  }

  const { requestId } = await context.params
  const body = await readJsonBody(request)
  const parsed = premiumRequestActionSchema.safeParse(body)

  if (!parsed.success) {
    return jsonError('Invalid action payload', 422, parsed.error.flatten())
  }

  const existingRequest = await prisma.premiumRequest.findUnique({
    where: { id: requestId },
    include: {
      user: true,
    },
  })

  if (!existingRequest) {
    return jsonError('Premium request not found', 404)
  }

  if (existingRequest.status !== 'PENDING') {
    return jsonError('Only pending requests can be handled.', 400)
  }

  const now = new Date()
  const handledAt = now

  if (parsed.data.action === 'approve') {
    const startDate = now
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    await prisma.subscription.upsert({
      where: { userId: existingRequest.userId },
      create: {
        userId: existingRequest.userId,
        status: 'PREMIUM',
        startDate,
        endDate,
      },
      update: {
        status: 'PREMIUM',
        startDate,
        endDate,
      },
    })

    const updated = await prisma.premiumRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        handledAt,
      },
    })

    await prisma.adminLog.create({
      data: {
        type: 'PREMIUM_REQUEST_APPROVED',
        message: `Premium request approved for ${existingRequest.user.email}`,
        adminId: admin.id,
        userId: existingRequest.userId,
      },
    })

    return NextResponse.json({ request: updated })
  }

  const updated = await prisma.premiumRequest.update({
    where: { id: requestId },
    data: {
      status: 'DECLINED',
      handledAt,
    },
  })

  await prisma.adminLog.create({
    data: {
      type: 'PREMIUM_REQUEST_DECLINED',
      message: `Premium request declined for ${existingRequest.user.email}`,
      adminId: admin.id,
      userId: existingRequest.userId,
    },
  })

  return NextResponse.json({ request: updated })
}
