import { z } from 'zod'

export const createTicketSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(10),
  category_id: z.string().uuid(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
})

export const updateTicketSchema = z.object({
  status: z.enum(['open', 'assigned', 'in_progress', 'pending', 'resolved', 'closed']).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
})

export type CreateTicketInput = z.infer<typeof createTicketSchema>
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>
