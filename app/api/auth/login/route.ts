import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAuthCookie, createAuthToken, verifyPassword } from '@/lib/auth'
import { jsonError, readJsonBody } from '@/lib/api'
import { loginSchema } from '@/lib/validators'

export async function POST(request: Request) {
  try {
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
      },
    })

    if (!user || !verifyPassword(parsed.data.password, user.password)) {
      return jsonError('Invalid email or password', 401)
    }

    const token = createAuthToken(user)
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
    res.cookies.set(createAuthCookie(token))
    return res
  } catch (error) {
    console.error('[LOGIN_FATAL_ERROR]', error)
    return jsonError('Internal server error during login', 500)
  }
}
