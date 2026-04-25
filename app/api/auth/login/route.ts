import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAuthCookie, createAuthToken, verifyPassword } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { loginSchema } from '@/lib/validators'

export async function POST(request: Request) {
  const body = await readJsonBody(request)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return jsonError('Invalid login data', 422, parsed.error.flatten())
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user || !verifyPassword(parsed.data.password, user.password)) {
    return jsonError('Invalid email or password', 401)
  }

  const token = createAuthToken(user)
  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  })
  response.cookies.set(createAuthCookie(token))
  return response
}
