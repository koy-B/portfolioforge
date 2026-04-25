import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { updateProjectSchema } from '@/lib/validators'

type Params = Promise<{ projectId: string }>

export async function PATCH(request: Request, context: { params: Params }) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)
  const { projectId } = await context.params
  const body = await readJsonBody(request)
  const parsed = updateProjectSchema.safeParse(body)

  if (!parsed.success) {
    return jsonError('Invalid project data', 422, parsed.error.flatten())
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      portfolio: { userId: user.id },
    },
  })

  if (!project) return jsonError('Project not found', 404)

  if (parsed.data.portfolioId) {
    const targetPortfolio = await prisma.portfolio.findFirst({
      where: {
        id: parsed.data.portfolioId,
        userId: user.id,
      },
    })

    if (!targetPortfolio) {
      return jsonError('Target portfolio not found', 404)
    }
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? '',
      imageUrl: parsed.data.imageUrl ?? '',
      link: parsed.data.link ?? '',
      ...(parsed.data.portfolioId
        ? {
            portfolioId: parsed.data.portfolioId,
          }
        : {}),
    },
  })

  return NextResponse.json({ project: updated })
}

export async function DELETE(_: Request, context: { params: Params }) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)
  const { projectId } = await context.params

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      portfolio: { userId: user.id },
    },
  })

  if (!project) return jsonError('Project not found', 404)

  await prisma.project.delete({ where: { id: projectId } })
  return NextResponse.json({ ok: true })
}

export async function GET(_: Request, context: { params: Params }) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)
  const { projectId } = await context.params

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      portfolio: { userId: user.id },
    },
  })

  if (!project) return jsonError('Project not found', 404)

  return NextResponse.json({ project })
}
