import { portfolioTemplates, profileTypes } from '@/lib/validators'

export const APP_NAME = 'PortfolioForge'
export const APP_DESCRIPTION = 'Build, manage, and publish a polished portfolio in one place.'
export type ProfileType = (typeof profileTypes)[number]
export type PortfolioTemplate = (typeof portfolioTemplates)[number]

export function cnSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ensureUniqueSlug(base: string, suffix?: string) {
  const cleanBase = cnSlug(base) || 'portfolio'
  return suffix ? `${cleanBase}-${cnSlug(suffix)}` : cleanBase
}

export function profileTypeLabel(type: string) {
  const value = type.trim()
  if (!value) return ''
  return value[0].toUpperCase() + value.slice(1)
}

export function templateLabel(template: string) {
  const value = template.trim()
  if (!value) return ''
  return value[0] + value.slice(1).toLowerCase()
}

export function whatsappPremiumLink(username: string) {
  const message = encodeURIComponent(`Hello, I want to upgrade to premium. Username: ${username}`)
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '')
  return phone ? `https://wa.me/${phone}?text=${message}` : `https://wa.me/?text=${message}`
}

export function formatDate(value?: string | Date | null) {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
