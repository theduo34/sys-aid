import { z } from 'zod'

export const createTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category_id: z.string().uuid().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  attachment_url: z.string().url().nullable().optional(),
})

export const updateTicketSchema = z.object({
  status: z.enum(['open', 'assigned', 'in_progress', 'pending', 'resolved', 'closed']).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  resolved_at: z.string().nullable().optional(),
})

export type CreateTicketInput = z.infer<typeof createTicketSchema>
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>
