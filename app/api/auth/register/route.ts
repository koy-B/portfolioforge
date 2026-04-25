import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAuthCookie, createAuthToken, hashPassword } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { registerSchema } from '@/lib/validators'
import { Role } from '@prisma/client'

export async function POST(request: Request) {
  const body = await readJsonBody(request)
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return jsonError('Invalid registration data', 422, parsed.error.flatten())
  }

  const { name, email, password } = parsed.data
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    return jsonError('An account with that email already exists', 409)
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword(password),
      role: Role.USER,
      profile: {
        create: {
          type: 'developer',
          bio: '',
          avatarUrl: '',
        },
      },
      subscription: {
        create: {
          status: 'FREE',
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const token = createAuthToken(user)
  const response = NextResponse.json(
    {
      user,
    },
    { status: 201 },
  )
  response.cookies.set(createAuthCookie(token))
  return response
}
