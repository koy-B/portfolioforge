import { z } from 'zod'

export const profileTypes = ['developer', 'designer', 'student', 'entrepreneur', 'photographer'] as const
export const portfolioTemplates = ['AURORA', 'MIDNIGHT', 'EDITORIAL', 'MINIMAL', 'SPLIT'] as const

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
})

export const loginSchema = registerSchema.pick({
  email: true,
  password: true,
})

export const profileSchema = z.object({
  type: z.enum(profileTypes),
  bio: z.string().trim().max(500).optional().default(''),
  avatarUrl: z.string().trim().url().optional().or(z.literal('')).default(''),
})

export const portfolioSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().default(''),
  template: z.enum(portfolioTemplates),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .or(z.literal(''))
    .default(''),
  isPublished: z.boolean().optional().default(false),
})

export const projectSchema = z.object({
  portfolioId: z.string().cuid(),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().default(''),
  imageUrl: z.string().trim().url().optional().or(z.literal('')).default(''),
  link: z.string().trim().url().optional().or(z.literal('')).default(''),
})

export const updateProjectSchema = projectSchema
  .omit({ portfolioId: true })
  .extend({
    portfolioId: z.string().cuid().optional(),
  })

export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN']),
})

export const subscriptionActionSchema = z.object({
  userId: z.string().cuid(),
})

export const premiumRequestSchema = z.object({
  message: z.string().trim().max(500).optional().default(''),
  templatePreference: z.enum(portfolioTemplates).optional(),
})

export const premiumRequestActionSchema = z.object({
  action: z.enum(['approve', 'decline']),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type PortfolioInput = z.infer<typeof portfolioSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type PremiumRequestInput = z.infer<typeof premiumRequestSchema>
export type PremiumRequestAction = z.infer<typeof premiumRequestActionSchema>
