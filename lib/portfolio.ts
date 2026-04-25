import { prisma } from '@/lib/prisma'

export async function getPublicPortfolioBySlug(slug: string) {
  return prisma.portfolio.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          subscription: true,
        },
      },
      projects: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export async function getDashboardSummary(userId: string) {
  const [portfolioCount, publishedCount, projectCount, premiumSubscription] = await Promise.all([
    prisma.portfolio.count({ where: { userId } }),
    prisma.portfolio.count({ where: { userId, isPublished: true } }),
    prisma.project.count({
      where: {
        portfolio: { userId },
      },
    }),
    prisma.subscription.findUnique({ where: { userId } }),
  ])

  return {
    portfolioCount,
    publishedCount,
    projectCount,
    premiumSubscription,
  }
}
