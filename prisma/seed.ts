import { prisma } from '../lib/prisma'
import { Role, SubscriptionStatus } from '@prisma/client'
import { hashPassword } from '../lib/auth'
import { cnSlug } from '../lib/site'

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@portfolioforge.local'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin1234!'
  const name = process.env.SEED_ADMIN_NAME ?? 'Admin'

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: Role.ADMIN,
      password: hashPassword(password),
    },
    create: {
      email,
      name,
      role: Role.ADMIN,
      password: hashPassword(password),
    },
  })

  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {
      type: 'entrepreneur',
      bio: 'Platform administrator',
      avatarUrl: '',
    },
    create: {
      userId: admin.id,
      type: 'entrepreneur',
      bio: 'Platform administrator',
      avatarUrl: '',
    },
  })

  await prisma.subscription.upsert({
    where: { userId: admin.id },
    update: {
      status: SubscriptionStatus.PREMIUM,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    create: {
      userId: admin.id,
      status: SubscriptionStatus.PREMIUM,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  const portfolioSlug = cnSlug('admin-showcase')
  await prisma.portfolio.upsert({
    where: { slug: portfolioSlug },
    update: {},
    create: {
      userId: admin.id,
      title: 'Admin Showcase',
      description: 'Starter portfolio for the platform owner.',
      template: 'EDITORIAL',
      slug: portfolioSlug,
      isPublished: true,
    },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
