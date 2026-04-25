import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { portfolioSchema } from '@/lib/validators'
import { prisma } from '@/lib/prisma'
import { PortfolioTemplate } from '@prisma/client'
import { cnSlug } from '@/lib/site'

async function makeUniqueSlug(base: string, excludeId?: string) {
  const root = cnSlug(base) || 'portfolio'
  let slug = root
  let index = 1

  while (
    await prisma.portfolio.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    })
  ) {
    index += 1
    slug = `${root}-${index}`
  }

  return slug
}

type Params = Promise<{ portfolioId: string }>

export async function GET(_: Request, context: { params: Params }) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)
  const { portfolioId } = await context.params

  const portfolio = await prisma.portfolio.findFirst({
    where: { id: portfolioId, userId: user.id },
    include: { projects: true },
  })

  if (!portfolio) return jsonError('Portfolio not found', 404)
  return NextResponse.json({ portfolio })
}

export async function PATCH(request: Request, context: { params: Params }) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)
  const { portfolioId } = await context.params
  const body = await readJsonBody(request)
  const parsed = portfolioSchema.partial().safeParse(body)

  if (!parsed.success) {
    return jsonError('Invalid portfolio data', 422, parsed.error.flatten())
  }

  const existing = await prisma.portfolio.findFirst({
    where: { id: portfolioId, userId: user.id },
  })

  if (!existing) {
    return jsonError('Portfolio not found', 404)
  }

  const slug =
    parsed.data.slug !== undefined
      ? await makeUniqueSlug(parsed.data.slug || parsed.data.title || existing.slug, portfolioId)
      : existing.slug

  const portfolio = await prisma.portfolio.update({
    where: { id: portfolioId },
    data: {
      title: parsed.data.title ?? existing.title,
      description: parsed.data.description ?? existing.description,
      template: (parsed.data.template ?? existing.template) as PortfolioTemplate,
      slug,
      isPublished: parsed.data.isPublished ?? existing.isPublished,
    },
  })

  return NextResponse.json({ portfolio })
}

export async function DELETE(_: Request, context: { params: Params }) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)
  const { portfolioId } = await context.params

  const existing = await prisma.portfolio.findFirst({
    where: { id: portfolioId, userId: user.id },
  })

  if (!existing) {
    return jsonError('Portfolio not found', 404)
  }

  await prisma.portfolio.delete({ where: { id: portfolioId } })
  return NextResponse.json({ ok: true })
}
