import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Promoting all users in the database to ADMIN...')
  const result = await prisma.user.updateMany({
    data: { role: 'ADMIN' }
  })
  console.log(`Success! Updated ${result.count} users to ADMIN role.`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
