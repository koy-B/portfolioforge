import { NextResponse } from 'next/server'
import { getPublicPortfolioBySlug } from '@/lib/portfolio'

type Params = Promise<{ slug: string }>

export async function GET(_: Request, context: { params: Params }) {
  const { slug } = await context.params
  const portfolio = await getPublicPortfolioBySlug(slug)

  if (!portfolio || !portfolio.isPublished) {
    return NextResponse.json({ portfolio: null }, { status: 404 })
  }

  return NextResponse.json({ portfolio })
}
