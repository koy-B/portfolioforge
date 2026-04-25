import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { jsonError } from '@/lib/api'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ portfolioId: string }>

export async function PATCH(_: Request, context: { params: Params }) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)
  const { portfolioId } = await context.params

  const portfolio = await prisma.portfolio.findFirst({
    where: { id: portfolioId, userId: user.id },
  })

  if (!portfolio) {
    return jsonError('Portfolio not found', 404)
  }

  const updated = await prisma.portfolio.update({
    where: { id: portfolioId },
    data: { isPublished: true },
  })

  return NextResponse.json({ portfolio: updated })
}
