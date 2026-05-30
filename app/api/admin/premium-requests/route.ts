import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/auth'
import { jsonError } from '@/lib/api'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return jsonError('Unauthorized', 401)
  }

  const requests = await prisma.premiumRequest.findMany({
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
  })

  return NextResponse.json({ requests })
}
