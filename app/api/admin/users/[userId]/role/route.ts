import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { getCurrentAdminUser } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { updateUserRoleSchema } from '@/lib/validators'

type Params = Promise<{ userId: string }>

export async function PATCH(request: Request, context: { params: Params }) {
  const admin = await getCurrentAdminUser()
  if (!admin) return jsonError('Unauthorized', 401)

  const { userId } = await context.params
  const body = await readJsonBody(request)
  const parsed = updateUserRoleSchema.safeParse(body)

  if (!parsed.success) {
    return jsonError('Invalid role payload', 422, parsed.error.flatten())
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })

  if (!targetUser) {
    return jsonError('User not found', 404)
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.data.role as Role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({ user: updated })
}
