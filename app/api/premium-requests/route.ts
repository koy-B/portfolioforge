import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { premiumRequestSchema } from '@/lib/validators'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return jsonError('Unauthorized', 401)
  }

  const body = await readJsonBody(request)
  const parsed = premiumRequestSchema.safeParse(body)

  if (!parsed.success) {
    return jsonError('Invalid request payload', 422, parsed.error.flatten())
  }

  const existingRequest = await prisma.premiumRequest.findFirst({
    where: {
      userId: user.id,
      status: 'PENDING',
    },
  })

  if (existingRequest) {
    return jsonError('You already have a pending premium request.', 409)
  }

  const requestRecord = await prisma.premiumRequest.create({
    data: {
      userId: user.id,
      message: parsed.data.message,
      templatePreference: parsed.data.templatePreference ?? undefined,
    },
  })

  await prisma.adminLog.create({
    data: {
      type: 'PREMIUM_REQUEST_CREATED',
      message: `Premium request created by ${user.email}`,
      userId: user.id,
    },
  })

  return NextResponse.json({ request: requestRecord })
}
