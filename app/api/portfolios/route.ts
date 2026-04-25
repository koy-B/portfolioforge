import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { portfolioSchema } from '@/lib/validators'
import { prisma } from '@/lib/prisma'
import { cnSlug } from '@/lib/site'
import { PortfolioTemplate } from '@prisma/client'

async function makeUniqueSlug(base: string) {
  const root = cnSlug(base) || 'portfolio'
  let slug = root
  let index = 1

  while (await prisma.portfolio.findUnique({ where: { slug } })) {
    index += 1
    slug = `${root}-${index}`
  }

  return slug
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)

  const portfolios = await prisma.portfolio.findMany({
    where: { userId: user.id },
    include: {
      projects: true,
      _count: {
        select: { projects: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ portfolios })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Unauthorized', 401)

  const body = await readJsonBody(request)
  const parsed = portfolioSchema.safeParse(body)

  if (!parsed.success) {
    return jsonError('Invalid portfolio data', 422, parsed.error.flatten())
  }

  const slug = await makeUniqueSlug(parsed.data.slug || parsed.data.title)

  const portfolio = await prisma.portfolio.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      description: parsed.data.description ?? '',
      template: parsed.data.template as PortfolioTemplate,
      slug,
      isPublished: parsed.data.isPublished,
    },
    include: {
      projects: true,
    },
  })

  return NextResponse.json({ portfolio }, { status: 201 })
}
