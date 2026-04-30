import type { Profile } from '@/types/types_db'

export interface RoleRequest {
  id: string
  user_id: string
  requested_role: 'staff'
  reason: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by: string | null
  created_at: string
  reviewed_at: string | null
}

export interface RoleRequestWithUser extends RoleRequest {
  user: Pick<Profile, 'id' | 'full_name' | 'role' | 'department'>
}
