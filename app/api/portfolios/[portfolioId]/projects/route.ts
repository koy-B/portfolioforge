import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validators'

type Params = Promise<{ portfolioId: string }>

export async function GET(_: Request, context: { params: Params }) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)
  const { portfolioId } = await context.params

  const portfolio = await prisma.portfolio.findFirst({
    where: { id: portfolioId, userId: user.id },
    include: { projects: { orderBy: { createdAt: 'desc' } } },
  })

  if (!portfolio) return jsonError('Portfolio not found', 404)
  return NextResponse.json({ projects: portfolio.projects })
}

export async function POST(request: Request, context: { params: Params }) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)
  const { portfolioId } = await context.params
  const body = await readJsonBody(request)
  const parsed = projectSchema.safeParse({ ...(body ?? {}), portfolioId })

  if (!parsed.success) {
    return jsonError('Invalid project data', 422, parsed.error.flatten())
  }

  const portfolio = await prisma.portfolio.findFirst({
    where: { id: portfolioId, userId: user.id },
  })

  if (!portfolio) return jsonError('Portfolio not found', 404)

  const project = await prisma.project.create({
    data: {
      portfolioId,
      title: parsed.data.title,
      description: parsed.data.description ?? '',
      imageUrl: parsed.data.imageUrl ?? '',
      link: parsed.data.link ?? '',
    },
  })

  return NextResponse.json({ project }, { status: 201 })
}
