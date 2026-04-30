export const TICKET_STATUSES = ['open', 'assigned', 'in_progress', 'pending', 'resolved', 'closed'] as const
export const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const
export const ROLES = ['student', 'staff', 'technician', 'admin'] as const

export type TicketStatus = (typeof TICKET_STATUSES)[number]
export type Priority = (typeof PRIORITIES)[number]

// SLA resolution targets in hours keyed by priority
export const SLA_HOURS: Record<Priority, { response: number; resolution: number }> = {
  critical: { response: 1, resolution: 4 },
  high:     { response: 4, resolution: 24 },
  medium:   { response: 24, resolution: 72 },
  low:      { response: 72, resolution: 168 },
}
