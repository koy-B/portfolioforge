import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing connection to Neon...')
  try {
    const userCount = await prisma.user.count()
    console.log('Connection successful!')
    console.log('Current user count:', userCount)
    
    const users = await prisma.user.findMany({
      select: { email: true, role: true }
    })
    console.log('Users in DB:', users)
  } catch (error) {
    console.error('Connection failed!')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
