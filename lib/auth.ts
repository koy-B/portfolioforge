import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Role, type User } from '@prisma/client'

export const AUTH_COOKIE_NAME = 'portfolioforge_session'
const PASSWORD_KEY_LEN = 64
const PASSWORD_ITERATIONS = 120_000
const PASSWORD_DIGEST = 'sha256'

type SessionPayload = {
  sub: string
  email: string
  name: string
  role: Role
  exp: number
}

export type SafeUser = Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt' | 'updatedAt'>

const AUTH_SECRET = process.env.AUTH_SECRET ?? 'portfolioforge-development-secret'

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString('base64url')
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(value: string) {
  return crypto.createHmac('sha256', AUTH_SECRET).update(value).digest('base64url')
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LEN, PASSWORD_DIGEST)
    .toString('hex')

  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedPassword: string) {
  const [salt, hash] = storedPassword.split(':')
  if (!salt || !hash) return false

  const derived = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LEN, PASSWORD_DIGEST)
    .toString('hex')

  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'))
}

export function createAuthToken(user: Pick<User, 'id' | 'email' | 'name' | 'role'>) {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  }
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = sign(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function verifyAuthToken(token?: string | null) {
  if (!token) return null
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return null
  if (sign(encodedPayload) !== signature) return null

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  return getUserFromToken(token)
}

export async function getAuthPayload() {
  const cookieStore = await cookies()
  return verifyAuthToken(cookieStore.get(AUTH_COOKIE_NAME)?.value)
}

export async function getUserFromToken(token?: string | null): Promise<SafeUser | null> {
  const payload = verifyAuthToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return user
}

export async function getCurrentAdminUser() {
  const user = await getCurrentUser()
  if (!user || user.role !== Role.ADMIN) {
    return null
  }

  return user
}

export function createAuthCookie(token: string) {
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    },
  }
}

export function clearAuthCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    },
  }
}

export function isAdminRole(role?: string | null) {
  return role === Role.ADMIN
}
