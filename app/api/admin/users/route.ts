import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/auth'
import { jsonError } from '@/lib/api'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return jsonError('Unauthorized', 401)

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      subscription: true,
      portfolios: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ users })
}
