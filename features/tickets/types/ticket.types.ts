import type { Ticket, Category, Profile } from '@/types/types_db'

export type { Ticket }

export interface TicketWithRelations extends Ticket {
  category: Category | null
  created_by_profile: Pick<Profile, 'id' | 'full_name' | 'email' | 'role'> | null
  assigned_to_profile: Pick<Profile, 'id' | 'full_name'> | null
}
