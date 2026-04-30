import { z } from 'zod'

export const createRoleRequestSchema = z.object({
  reason: z.string().min(10, 'Please explain why you need staff access').max(500),
})

export const reviewRoleRequestSchema = z.object({
  status: z.enum(['approved', 'rejected']),
})

export type CreateRoleRequestInput = z.infer<typeof createRoleRequestSchema>
export type ReviewRoleRequestInput = z.infer<typeof reviewRoleRequestSchema>
