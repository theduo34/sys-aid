import { z } from 'zod'

export const updateUserSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  role: z.enum(['student', 'staff', 'technician', 'admin']).optional(),
  department: z.string().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
